package com.foodrescue.api.controller;

import com.foodrescue.api.model.*;
import com.foodrescue.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/donor")
public class DonorController {

    @Autowired
    private DonationRepository donationRepository;
    @Autowired
    private RequestRepository requestRepository;

    @GetMapping("/{donorId}/donations")
    public List<Donation> getMyDonations(@PathVariable @NonNull String donorId) {
        return donationRepository.findByDonorId(donorId);
    }

    @GetMapping("/{donorId}/requests")
    public List<Request> getRequestsForMe(@PathVariable @NonNull String donorId) {
        List<Donation> donorDonations = donationRepository.findByDonorId(donorId);
        List<Request> donorRequests = new ArrayList<>();
        for (Donation donation : donorDonations) {
            donorRequests.addAll(requestRepository.findByDonationId(donation.getId()));
        }
        return donorRequests;
    }

    @PostMapping("/requests/{requestId}/respond")
    public Request respondToRequest(@PathVariable @NonNull String requestId, @RequestParam String status,
            @RequestParam(required = false) String donorMessage) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status); // APPROVED or REJECTED
        if (donorMessage != null) {
            request.setDonorMessage(donorMessage);
        }
        request.setRespondedAt(LocalDateTime.now());

        if (status.equals("APPROVED")) {
            Donation donation = request.getDonation();
            donation.setStatus("RESERVED");
            donationRepository.save(donation);

            // Reject other pending requests for this donation
            List<Request> otherRequests = requestRepository.findByDonationId(donation.getId());
            for (Request other : otherRequests) {
                if (!other.getId().equals(requestId) && "PENDING".equals(other.getStatus())) {
                    other.setStatus("REJECTED");
                    other.setDonorMessage("Donation was assigned to another NGO.");
                    requestRepository.save(other);
                }
            }
        } else if (status.equals("REJECTED")) {
            // Only set back to AVAILABLE if there are no other PENDING requests
            Donation donation = request.getDonation();
            List<Request> pendingRequests = requestRepository.findByDonationId(donation.getId());
            boolean hasOtherPending = pendingRequests.stream()
                    .anyMatch(r -> !r.getId().equals(requestId) && "PENDING".equals(r.getStatus()));
            if (!hasOtherPending) {
                donation.setStatus("AVAILABLE");
                donationRepository.save(donation);
            }
        }

        return requestRepository.save(request);
    }

    @PostMapping("/requests/{requestId}/collect")
    public Request collectRequest(@PathVariable @NonNull String requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("COLLECTED");
        Donation donation = request.getDonation();
        donation.setStatus("COLLECTED");

        donationRepository.save(donation);
        return requestRepository.save(request);
    }
}
