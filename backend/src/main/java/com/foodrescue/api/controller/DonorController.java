package com.foodrescue.api.controller;

import com.foodrescue.api.model.*;
import com.foodrescue.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/donor")
@CrossOrigin(origins = "*")
public class DonorController {

    @Autowired
    private DonationRepository donationRepository;
    @Autowired
    private RequestRepository requestRepository;

    @GetMapping("/{donorId}/donations")
    public List<Donation> getMyDonations(@PathVariable Long donorId) {
        return donationRepository.findByDonorId(donorId);
    }

    @GetMapping("/{donorId}/requests")
    public List<Request> getRequestsForMe(@PathVariable Long donorId) {
        return requestRepository.findByDonationDonorId(donorId);
    }

    @PostMapping("/requests/{requestId}/respond")
    public Request respondToRequest(@PathVariable Long requestId, @RequestParam String status) {
        @SuppressWarnings("null")
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status); // APPROVED or REJECTED
        request.setRespondedAt(LocalDateTime.now());

        if (status.equals("APPROVED")) {
            Donation donation = request.getDonation();
            donation.setStatus("RESERVED");
            donationRepository.save(donation);
        }

        return requestRepository.save(request);
    }

    @PostMapping("/requests/{requestId}/collect")
    public Request collectRequest(@PathVariable Long requestId) {
        @SuppressWarnings("null")
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("COLLECTED");
        Donation donation = request.getDonation();
        donation.setStatus("COLLECTED");

        donationRepository.save(donation);
        return requestRepository.save(request);
    }
}
