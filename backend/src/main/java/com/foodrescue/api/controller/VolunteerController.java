package com.foodrescue.api.controller;

import com.foodrescue.api.model.User;
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

    @GetMapping("/ngo/{ngoId}")
    public List<User> getNgoVolunteers(@PathVariable String ngoId) {
        return userRepository.findAll().stream()
                .filter(u -> "VOLUNTEER".equals(u.getRole()) && ngoId.equals(u.getAffiliatedNgoId()))
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveVolunteer(@PathVariable String id) {
        User volunteer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
        volunteer.setVolunteerStatus("APPROVED");
        userRepository.save(volunteer);
        return ResponseEntity.ok("Volunteer approved successfully");
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectVolunteer(@PathVariable String id) {
        User volunteer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
        volunteer.setVolunteerStatus("REJECTED");
        userRepository.save(volunteer);
        return ResponseEntity.ok("Volunteer rejected successfully");
    }
}
