package com.foodrescue.api.controller;

import com.foodrescue.api.model.Donation;
import com.foodrescue.api.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {

    @Autowired
    private DonationRepository donationRepository;

    @GetMapping("/available")
    public List<Donation> getAvailableDonations() {
        return donationRepository.findByStatus("AVAILABLE");
    }

    @PostMapping("/create")
    public Donation createDonation(@RequestBody Donation donation) {
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
