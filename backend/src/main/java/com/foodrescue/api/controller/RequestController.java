package com.foodrescue.api.controller;

import com.foodrescue.api.model.*;
import com.foodrescue.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    @SuppressWarnings("null")
    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@RequestBody Request request) {
        if (request.getDonation() == null || request.getDonation().getId() == null) {
            return ResponseEntity.badRequest().body("Donation must be specified");
        }
        if (request.getNgo() == null || request.getNgo().getId() == null) {
            return ResponseEntity.badRequest().body("NGO must be specified");
        }

        Long donationId = request.getDonation().getId();
        Long ngoId = request.getNgo().getId();

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        User ngo = userRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        if (!"AVAILABLE".equals(donation.getStatus())) {
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

    @GetMapping("/ngo/{ngoId}")
    public List<Request> getNgoRequests(@PathVariable Long ngoId) {
        return requestRepository.findByNgoId(ngoId);
    }
}
