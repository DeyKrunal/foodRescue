package com.foodrescue.api.controller;

import com.foodrescue.api.model.Donation;
import com.foodrescue.api.model.Notification;
import com.foodrescue.api.repository.DonationRepository;
import com.foodrescue.api.repository.NotificationRepository;
import com.foodrescue.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@SuppressWarnings("null")
public class DonationController {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/available")
    public List<Donation> getAvailableDonations() {
        return donationRepository.findByStatusIn(Arrays.asList("AVAILABLE", "REQUESTED"));
    }

    @GetMapping("/near-me")
    public List<Donation> getNearDonations(
            @RequestParam double lon,
            @RequestParam double lat,
            @RequestParam(defaultValue = "30") double maxDistanceKm) {

        Point point = new Point(lon, lat);
        Distance distance = new Distance(maxDistanceKm, Metrics.KILOMETERS);
        return donationRepository.findByStatusInAndLocationNear(Arrays.asList("AVAILABLE", "REQUESTED"), point, distance);
    }

    @PostMapping("/create")
    public Donation createDonation(@RequestBody Donation donation) {
        // Ensure donor is set and has an ID
        if (donation.getDonor() != null && donation.getDonor().getId() != null) {
            String donorId = donation.getDonor().getId();
            userRepository.findById(donorId).ifPresent(donor -> {
                // Carry over the donor's precision location to the donation
                donation.setLocation(donor.getLocation());
                // Set the donor back to ensure DBRef is clean
                donation.setDonor(donor);
            });
        }
        
        donation.setStatus("AVAILABLE");
        donation.setCreatedAt(java.time.LocalDateTime.now());
        Donation saved = donationRepository.save(donation);

        // Notify Admin of new donation
        userRepository.findAll().stream()
            .filter(u -> "ADMIN".equals(u.getRole()))
            .forEach(admin -> {
                Notification n = new Notification();
                n.setRecipient(admin);
                n.setMessage("New food donation listing: '" + saved.getFoodItem() + "' by " + (saved.getDonor() != null ? saved.getDonor().getName() : "Unknown"));
                n.setType("INFO");
                notificationRepository.save(n);
            });

        return saved;
    }

    @PostMapping("/{id}/view")
    public Donation viewDonation(@PathVariable String id) {
        Donation donation = donationRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        donation.setViewCount(donation.getViewCount() + 1);
        return donationRepository.save(donation);
    }
}
