package com.foodrescue.api.controller;

import com.foodrescue.api.model.Delivery;
import com.foodrescue.api.repository.DeliveryRepository;
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
            return ResponseEntity.ok(deliveryRepository.save(delivery));
        }).orElse(ResponseEntity.notFound().build());
    }
}
