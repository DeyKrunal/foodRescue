package com.foodrescue.api.controller;

import com.foodrescue.api.model.Notification;
import com.foodrescue.api.model.User;
import com.foodrescue.api.repository.NotificationRepository;
import com.foodrescue.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/volunteers")
public class VolunteerController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/ngo/{ngoId}")
    public List<User> getNgoVolunteers(@PathVariable String ngoId) {
        User ngo = userRepository.findById(ngoId).orElse(null);
        String filterId = (ngo != null && ngo.getNgoId() != null) ? ngo.getNgoId() : ngoId;

        return userRepository.findAll().stream()
                .filter(u -> "VOLUNTEER".equals(u.getRole()) &&
                        (filterId.equals(u.getAffiliatedNgoId()) || ngoId.equals(u.getAffiliatedNgoId())))
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveVolunteer(@PathVariable String id) {
        User volunteer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
        volunteer.setVolunteerStatus("APPROVED");
        userRepository.save(volunteer);

        // [FIX] Update NGO Volunteer Count
        if (volunteer.getAffiliatedNgoId() != null) {
            userRepository.findByNgoId(volunteer.getAffiliatedNgoId()).ifPresent(ngo -> {
                int currentCount = ngo.getNumberOfVolunteers() != null ? ngo.getNumberOfVolunteers() : 0;
                ngo.setNumberOfVolunteers(currentCount + 1);
                userRepository.save(ngo);
            });
        }

        // Notify volunteer
        Notification n = new Notification();
        n.setRecipient(volunteer);
        n.setMessage("Your volunteer application has been approved. You can now start accepting delivery tasks.");
        n.setType("SUCCESS");
        notificationRepository.save(n);

        return ResponseEntity.ok("Volunteer approved successfully");
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectVolunteer(@PathVariable String id) {
        User volunteer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
        volunteer.setVolunteerStatus("REJECTED");
        userRepository.save(volunteer);

        // Notify volunteer
        Notification n = new Notification();
        n.setRecipient(volunteer);
        n.setMessage("Your volunteer application was not approved at this time.");
        n.setType("ALERT");
        notificationRepository.save(n);

        return ResponseEntity.ok("Volunteer rejected successfully");
    }
}
