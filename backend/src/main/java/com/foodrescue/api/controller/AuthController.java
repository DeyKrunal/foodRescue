package com.foodrescue.api.controller;

import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Random;

import com.foodrescue.api.service.EmailService;
import com.foodrescue.api.repository.UserRepository;
import com.foodrescue.api.model.User;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Generate random 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setVerificationCode(otp);
        user.setVerificationExpires(LocalDateTime.now().plusMinutes(15));
        user.setVerified(false);

        User savedUser = userRepository.save(user);

        try {
            emailService.sendVerificationEmail(user.getEmail(), otp);
        } catch (Exception e) {
            return ResponseEntity.ok("Registration successful, but failed to send email. Code is: " + otp);
        }

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        if (user.isVerified()) {
            return ResponseEntity.ok("User already verified");
        }

        if (user.getVerificationExpires().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Verification code expired");
        }

        if (user.getVerificationCode().equals(code)) {
            user.setVerified(true);
            user.setVerificationCode(null);
            userRepository.save(user);
            return ResponseEntity.ok("Email verified successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid verification code");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            // Set session attribute
            request.getSession().setAttribute("user", user.get());
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        return ResponseEntity.ok("Logged out");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Not authenticated");
    }
}
