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
    @Autowired
    private NotificationRepository notificationRepository;

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

            // Notify the approved NGO
            Notification n = new Notification();
            n.setRecipient(request.getNgo());
            n.setMessage("Your rescue request for '" + donation.getFoodItem() + "' has been approved by " + donation.getDonor().getName());
            n.setType("SUCCESS");
            notificationRepository.save(n);

            // Reject other pending requests for this donation
            List<Request> otherRequests = requestRepository.findByDonationId(donation.getId());
            for (Request other : otherRequests) {
                if (!other.getId().equals(requestId) && "PENDING".equals(other.getStatus())) {
                    other.setStatus("REJECTED");
                    other.setDonorMessage("Donation was assigned to another NGO.");
                    requestRepository.save(other);

                    // Notify the rejected NGOs
                    Notification nOther = new Notification();
                    nOther.setRecipient(other.getNgo());
                    nOther.setMessage("Your rescue request for '" + donation.getFoodItem() + "' was rejected (assigned to another NGO).");
                    nOther.setType("ALERT");
                    notificationRepository.save(nOther);
                }
            }
        } else if (status.equals("REJECTED")) {
            // Notify the rejected NGO
            Notification n = new Notification();
            n.setRecipient(request.getNgo());
            n.setMessage("Your rescue request for '" + request.getDonation().getFoodItem() + "' was rejected by the donor.");
            n.setType("ALERT");
            notificationRepository.save(n);

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

        // Notify NGO
        Notification n = new Notification();
        n.setRecipient(request.getNgo());
        n.setMessage("The donation '" + donation.getFoodItem() + "' has been marked as collected by the donor.");
        n.setType("SUCCESS");
        notificationRepository.save(n);

        donationRepository.save(donation);
        return requestRepository.save(request);
    }
}
