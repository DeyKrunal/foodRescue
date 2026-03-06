package com.foodrescue.api.controller;

import com.foodrescue.api.model.Donation;
import com.foodrescue.api.repository.DonationRepository;
import com.foodrescue.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/available")
    public List<Donation> getAvailableDonations() {
        return donationRepository.findByStatus("AVAILABLE");
    }

    @GetMapping("/near-me")
    public List<Donation> getNearDonations(
            @RequestParam double lon,
            @RequestParam double lat,
            @RequestParam(defaultValue = "30") double maxDistanceKm) {

        Point point = new Point(lon, lat);
        Distance distance = new Distance(maxDistanceKm, Metrics.KILOMETERS);
        return donationRepository.findByStatusAndLocationNear("AVAILABLE", point, distance);
    }

    @PostMapping("/create")
    public Donation createDonation(@RequestBody Donation donation) {
        if (donation.getDonor() != null && donation.getDonor().getId() != null) {
            userRepository.findById(donation.getDonor().getId()).ifPresent(donor -> {
                donation.setLocation(donor.getLocation());
            });
        }
        donation.setStatus("AVAILABLE");
        return donationRepository.save(donation);
    }

    @PostMapping("/{id}/claim")
    public Donation claimDonation(@PathVariable String id) {
        Donation donation = donationRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        donation.setStatus("CLAIMED");
        return donationRepository.save(donation);
    }
}
