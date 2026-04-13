package com.foodrescue.api.controller;

import com.foodrescue.api.model.Delivery;
import com.foodrescue.api.model.Notification;
import com.foodrescue.api.repository.DeliveryRepository;
import com.foodrescue.api.repository.NotificationRepository;
import com.foodrescue.api.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/available")
    public List<Delivery> getAvailableDeliveries() {
        return deliveryRepository.findByStatus("PENDING");
    }

    @GetMapping("/my-tasks/{volunteerId}")
    public List<Delivery> getMyTasks(@PathVariable String volunteerId) {
        return deliveryRepository.findByVolunteerId(volunteerId);
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assignDelivery(@PathVariable String id, @RequestBody Map<String, String> request) {
        String volunteerId = request.get("volunteerId");

        return deliveryRepository.findById(id).map(delivery -> {
            delivery.setStatus("ASSIGNED");
            delivery.setUpdatedAt(LocalDateTime.now());
            // In a real app, you'd fetch the User object and set it
            // For now, we'll assume the client sends valid data or we handle logic in
            // service layer
            return ResponseEntity.ok(deliveryRepository.save(delivery));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/track")
    public ResponseEntity<?> updateLocation(@PathVariable @NonNull String id, @RequestBody double[] coordinates) {
        return deliveryRepository.findById(id).map(delivery -> {
            delivery.setCurrentCoordinates(coordinates);
            delivery.setUpdatedAt(LocalDateTime.now());
            if (delivery.getStatus().equals("ASSIGNED")) {
                delivery.setStatus("PICKED_UP");
                delivery.setPickedUpAt(LocalDateTime.now());
                
                // Notify NGO and Donor
                String msg = "Food item '" + delivery.getRequest().getDonation().getFoodItem() + "' has been picked up for delivery.";
                
                Notification n1 = new Notification();
                n1.setRecipient(delivery.getRequest().getNgo());
                n1.setMessage(msg);
                n1.setType("INFO");
                notificationRepository.save(n1);

                Notification n2 = new Notification();
                n2.setRecipient(delivery.getRequest().getDonation().getDonor());
                n2.setMessage(msg);
                n2.setType("INFO");
                notificationRepository.save(n2);

                try {
                    emailService.sendDeliveryUpdate(delivery.getRequest().getNgo().getEmail(), delivery.getRequest().getDonation().getFoodItem(), "PICKED UP");
                    emailService.sendDeliveryUpdate(delivery.getRequest().getDonation().getDonor().getEmail(), delivery.getRequest().getDonation().getFoodItem(), "PICKED UP");
                } catch (Exception e) {}
            }
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
            } catch (Exception e) {}

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
