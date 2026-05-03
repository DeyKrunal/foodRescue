package com.foodrescue.api.controller;

import com.foodrescue.api.model.*;
import com.foodrescue.api.repository.*;
import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DonationRepository donationRepository;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/stats")
    public Map<String, Object> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        List<User> allUsers = userRepository.findAll();

        long donors = allUsers.stream().filter(u -> "DONOR".equals(u.getRole())).count();
        long ngos = allUsers.stream().filter(u -> "NGO".equals(u.getRole())).count();
        long pending = allUsers.stream().filter(u -> !u.isVerified() && u.isEmailVerified() && !"ADMIN".equals(u.getRole())).count();

        stats.put("totalUsers", allUsers.size());
        stats.put("totalDonors", donors);
        stats.put("totalNgos", ngos);
        stats.put("totalDonations", donationRepository.count());
        stats.put("totalRequests", requestRepository.count());
        stats.put("activeListings", donationRepository.findByStatus("AVAILABLE").size());
        stats.put("pendingVerifications", pending);
        return stats;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/donations")
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    @PostMapping("/users/{id}/verify")
    public User verifyUser(@PathVariable @NonNull String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setVerified(true);

        // Notify user about verification
        Notification n = new Notification();
        n.setRecipient(user);
        n.setMessage("Your account has been verified by the Administrator. You now have full access to the platform.");
        n.setType("SUCCESS");
        notificationRepository.save(n);

        return userRepository.save(user);
    }
}
