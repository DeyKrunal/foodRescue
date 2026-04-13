package com.foodrescue.api.controller;

import com.foodrescue.api.model.*;
import com.foodrescue.api.repository.*;
import com.foodrescue.api.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/requests")
@SuppressWarnings("null")
public class RequestController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@RequestBody Request request) {
        if (request.getDonation() == null || request.getDonation().getId() == null) {
            return ResponseEntity.badRequest().body("Donation must be specified");
        }
        if (request.getNgo() == null || request.getNgo().getId() == null) {
            return ResponseEntity.badRequest().body("NGO must be specified");
        }

        String donationId = request.getDonation().getId();
        String ngoId = request.getNgo().getId();

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        User ngo = userRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        if (!"AVAILABLE".equals(donation.getStatus()) && !"REQUESTED".equals(donation.getStatus())) {
            return ResponseEntity.badRequest().body("Donation is no longer available");
        }

        request.setDonation(donation);
        request.setNgo(ngo);
        request.setStatus("PENDING");
        request.setRequestedAt(LocalDateTime.now());

        // Update donation status to REQUESTED
        donation.setStatus("REQUESTED");
        donationRepository.save(donation);

        Request savedRequest = requestRepository.save(request);

        // Notify Donor (App + Email)
        Notification notification = new Notification();
        notification.setRecipient(donation.getDonor());
        notification.setMessage("New rescue request for: " + donation.getFoodItem() + " from " + ngo.getName());
        notification.setType("REQUEST");
        notificationRepository.save(notification);

        try {
            emailService.sendNotification(
                    donation.getDonor().getEmail(),
                    "Rescue Request Received",
                    "Hello, " + ngo.getName() + " has expressed interest in rescuing your food item: "
                            + donation.getFoodItem());
        } catch (Exception e) {
            System.err.println("Email failed: " + e.getMessage());
        }

        return ResponseEntity.ok(savedRequest);
    }

    @Autowired
    private DeliveryRepository deliveryRepository;

    @PostMapping("/{id}/respond")
    public ResponseEntity<?> respondToRequest(@PathVariable String id, @RequestBody Map<String, String> response) {
        String status = response.get("status"); // ACCEPTED or REJECTED
        String message = response.get("message");

        return requestRepository.findById(id).map(request -> {
            request.setStatus(status);
            request.setDonorMessage(message);
            request.setRespondedAt(LocalDateTime.now());

            if ("ACCEPTED".equals(status) || "PARTIAL_ACCEPTED".equals(status)) {
                Donation donation = request.getDonation();

                if ("PARTIAL_ACCEPTED".equals(status)) {
                    // Create a new donation for the remaining food
                    String remainingQty = response.get("remainingQuantity");
                    if (remainingQty != null && !remainingQty.isEmpty()) {
                        Donation redonation = new Donation();
                        redonation.setFoodItem(donation.getFoodItem() + " (Remaining)");
                        redonation.setQuantity(remainingQty);
                        redonation.setDescription("Redonated from partial rescue: " + donation.getDescription());
                        redonation.setStatus("AVAILABLE");
                        redonation.setDonor(donation.getDonor());
                        redonation.setLocation(donation.getLocation());
                        redonation.setPickupLocation(donation.getPickupLocation());
                        redonation.setPickupWindow(donation.getPickupWindow());
                        donationRepository.save(redonation);
                    }
                }

                donation.setStatus("RESCUED");
                donationRepository.save(donation);

                // Create Delivery record
                Delivery delivery = new Delivery();
                delivery.setRequest(request);
                delivery.setStatus("PENDING");
                delivery.setPickupPoint(donation.getPickupLocation());
                delivery.setDeliveryPoint(request.getNgo().getAddress());
                deliveryRepository.save(delivery);
            }

            Request savedRequest = requestRepository.save(request);

            // Notify NGO (App + Email)
            Notification notification = new Notification();
            notification.setRecipient(request.getNgo());
            notification.setMessage(
                    "Your rescue request for " + request.getDonation().getFoodItem() + " was " + status.toLowerCase());
            notification.setType(status.equals("ACCEPTED") ? "SUCCESS" : "ALERT");
            notificationRepository.save(notification);

            try {
                emailService.sendNotification(
                        request.getNgo().getEmail(),
                        "Rescue Request Outcome: " + status,
                        "Your request for '" + request.getDonation().getFoodItem() + "' was " + status.toLowerCase()
                                + ". " + (message != null ? "\nDonor Message: " + message : ""));
            } catch (Exception e) {
                System.err.println("Email failed: " + e.getMessage());
            }

            return ResponseEntity.ok(savedRequest);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ngo/{ngoId}")
    public List<Request> getNgoRequests(@PathVariable String ngoId) {
        return requestRepository.findByNgoId(ngoId);
    }
}
