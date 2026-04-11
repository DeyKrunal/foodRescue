package com.foodrescue.api.controller;

import com.foodrescue.api.model.*;
import com.foodrescue.api.repository.*;
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

        return ResponseEntity.ok(requestRepository.save(request));
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

            return ResponseEntity.ok(requestRepository.save(request));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ngo/{ngoId}")
    public List<Request> getNgoRequests(@PathVariable String ngoId) {
        return requestRepository.findByNgoId(ngoId);
    }
}
