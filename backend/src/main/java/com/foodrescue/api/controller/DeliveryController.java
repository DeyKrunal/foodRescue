package com.foodrescue.api.controller;

import com.foodrescue.api.model.Delivery;
import com.foodrescue.api.model.Notification;
import com.foodrescue.api.model.User;
import com.foodrescue.api.repository.DeliveryRepository;
import com.foodrescue.api.repository.NotificationRepository;
import com.foodrescue.api.repository.UserRepository;
import com.foodrescue.api.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private static final Logger logger = LoggerFactory.getLogger(DeliveryController.class);

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/available")
    public List<Delivery> getAvailableDeliveries(@RequestParam String ngoId) {
        if (ngoId == null || ngoId.isEmpty()) return List.of();
        
        // Find NGO by either Mongo ID or User-defined NGO ID
        User ngo = userRepository.findById(ngoId)
                .orElseGet(() -> userRepository.findByNgoId(ngoId).orElse(null));
                
        if (ngo == null) {
            logger.warn("Available Deliveries requested for non-existent NGO ID: {}", ngoId);
            return List.of();
        }

        // Fetch all PENDING deliveries and filter manually.
        // We cannot use a repository method like findByStatusAndRequestNgoId
        // because MongoDB does not support querying across nested @DBRefs (Delivery -> Request -> NGO).
        return deliveryRepository.findByStatus("PENDING").stream()
                .filter(d -> d.getRequest() != null && 
                            d.getRequest().getNgo() != null && 
                            d.getRequest().getNgo().getId().equals(ngo.getId()))
                .collect(Collectors.toList());
    }

    @GetMapping("/donor/{donorId}")
    public List<Delivery> getDonorDeliveries(@PathVariable String donorId) {
        return deliveryRepository.findByRequestDonationDonorId(donorId);
    }

    @GetMapping("/ngo/{ngoId}")
    public List<Delivery> getNgoDeliveries(@PathVariable String ngoId) {
        return deliveryRepository.findByRequestNgoId(ngoId);
    }

    @GetMapping("/my-tasks/{volunteerId}")
    public List<Delivery> getMyTasks(@PathVariable String volunteerId) {
        return deliveryRepository.findByVolunteerId(volunteerId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDelivery(@PathVariable String id) {
        return deliveryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assignDelivery(@PathVariable String id, @RequestBody Map<String, String> request) {
        String volunteerId = request.get("volunteerId");
        User volunteer = userRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));

        return deliveryRepository.findById(id).map(delivery -> {
            delivery.setVolunteer(volunteer);
            delivery.setStatus("ASSIGNED");
            delivery.setUpdatedAt(LocalDateTime.now());

            // Generate 6-digit OTP for pickup
            SecureRandom random = new SecureRandom();
            String otp = String.format("%06d", random.nextInt(1000000));
            delivery.setPickupOtp(otp);

            Delivery saved = deliveryRepository.save(delivery);

            // Notify Donor with OTP
            if (delivery.getRequest() != null && delivery.getRequest().getDonation() != null) {
                User donor = delivery.getRequest().getDonation().getDonor();
                try {
                    emailService.sendNotification(donor.getEmail(), "Pickup OTP for Food Rescue",
                        "A volunteer (" + volunteer.getName() + ") has been assigned to rescue your food: " + 
                        delivery.getRequest().getDonation().getFoodItem() + ". \n\nYour Pickup OTP is: " + otp + 
                        "\n\nPlease provide this OTP to the volunteer when they arrive.");
                } catch (Exception e) {
                    logger.error("Failed to send OTP email to donor", e);
                }
            }

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/verify-otp")
    public ResponseEntity<?> verifyOtp(@PathVariable String id, @RequestBody Map<String, String> body) {
        String otp = body.get("otp");
        return deliveryRepository.findById(id).map(delivery -> {
            if (delivery.getPickupOtp() != null && delivery.getPickupOtp().equals(otp)) {
                delivery.setStatus("OTP_VERIFIED");
                delivery.setUpdatedAt(LocalDateTime.now());

                // Notify NGO to confirm pickup items
                if (delivery.getRequest() != null && delivery.getRequest().getNgo() != null) {
                    try {
                        emailService.sendNotification(
                            delivery.getRequest().getNgo().getEmail(),
                            "Action Required: Confirm Food Pickup",
                            "Volunteer " + (delivery.getVolunteer() != null ? delivery.getVolunteer().getName() : "Unknown") + " has verified the OTP at the donor location. Please review and confirm the food items on your dashboard."
                        );
                    } catch (Exception e) {
                        logger.error("Failed to send OTP verification notification to NGO", e);
                    }
                }

                return ResponseEntity.ok(deliveryRepository.save(delivery));
            }
            return ResponseEntity.badRequest().body("Invalid OTP");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/ngo-verify")
    public ResponseEntity<?> ngoVerify(@PathVariable String id) {
        return deliveryRepository.findById(id).map(delivery -> {
            delivery.setNgoVerified(true);
            if ("OTP_VERIFIED".equals(delivery.getStatus())) {
                delivery.setStatus("IN_TRANSIT");
                delivery.setPickedUpAt(LocalDateTime.now());

                if (delivery.getRequest() != null && delivery.getRequest().getDonation() != null) {
                    String foodItem = delivery.getRequest().getDonation().getFoodItem();

                    // Notify all parties via App
                    String msg = "Food item '" + foodItem + "' has been picked up for delivery.";
                    if (delivery.getRequest().getNgo() != null) {
                        Notification n1 = new Notification();
                        n1.setRecipient(delivery.getRequest().getNgo());
                        n1.setMessage(msg);
                        n1.setType("INFO");
                        notificationRepository.save(n1);
                    }

                    if (delivery.getRequest().getDonation().getDonor() != null) {
                        Notification n2 = new Notification();
                        n2.setRecipient(delivery.getRequest().getDonation().getDonor());
                        n2.setMessage(msg);
                        n2.setType("INFO");
                        notificationRepository.save(n2);
                    }

                    // Notify all parties via Email
                    try {
                        if (delivery.getVolunteer() != null) {
                            emailService.sendNotification(delivery.getVolunteer().getEmail(), "Rescue in Progress", "NGO has confirmed the pickup. You are now in transit for " + foodItem);
                        }
                        if (delivery.getRequest().getDonation().getDonor() != null) {
                            emailService.sendDeliveryUpdate(delivery.getRequest().getDonation().getDonor().getEmail(), foodItem, "PICKED UP");
                        }
                        if (delivery.getRequest().getNgo() != null) {
                            emailService.sendDeliveryUpdate(delivery.getRequest().getNgo().getEmail(), foodItem, "PICKED UP");
                        }
                    } catch (Exception e) {
                        logger.error("Failed to send NGO verification notifications", e);
                    }
                }
            }
            delivery.setUpdatedAt(LocalDateTime.now());
            deliveryRepository.save(delivery);
            return ResponseEntity.ok("Pickup confirmed by NGO. Status is now IN_TRANSIT.");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/track")
    public ResponseEntity<?> updateLocation(@PathVariable @NonNull String id, @RequestBody double[] coordinates) {
        return deliveryRepository.findById(id).map(delivery -> {
            if ("PENDING".equals(delivery.getStatus()) || "DELIVERED".equals(delivery.getStatus())) {
                return ResponseEntity.badRequest().body("Cannot track delivery in this status");
            }
            delivery.setCurrentCoordinates(coordinates);
            delivery.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(deliveryRepository.save(delivery));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeDelivery(@PathVariable @NonNull String id) {
        return deliveryRepository.findById(id).map(delivery -> {
            delivery.setStatus("DELIVERED");
            delivery.setDeliveredAt(LocalDateTime.now());
            delivery.setUpdatedAt(LocalDateTime.now());
            
            Delivery saved = deliveryRepository.save(delivery);

            // Notify NGO and Donor
            String msg = "Success! Food item '" + delivery.getRequest().getDonation().getFoodItem() + "' has been delivered.";
            
            Notification n1 = new Notification();
            n1.setRecipient(delivery.getRequest().getNgo());
            n1.setMessage(msg);
            n1.setType("SUCCESS");
            notificationRepository.save(n1);

            Notification n2 = new Notification();
            n2.setRecipient(delivery.getRequest().getDonation().getDonor());
            n2.setMessage(msg);
            n2.setType("SUCCESS");
            notificationRepository.save(n2);

            try {
                emailService.sendDeliveryUpdate(delivery.getRequest().getNgo().getEmail(), delivery.getRequest().getDonation().getFoodItem(), "DELIVERED");
                emailService.sendDeliveryUpdate(delivery.getRequest().getDonation().getDonor().getEmail(), delivery.getRequest().getDonation().getFoodItem(), "DELIVERED");
            } catch (Exception e) {
                logger.error("Failed to send delivery completion email notification", e);
            }

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
