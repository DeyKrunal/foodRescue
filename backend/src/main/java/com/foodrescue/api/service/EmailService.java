package com.foodrescue.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${spring.mail.username:your-email@gmail.com}")
    private String fromEmail;

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("FoodRescue - Email Verification");
            message.setText("Your verification code is: " + code + "\n\nThis code will expire in 15 minutes.");
            mailSender.send(message);
            logger.info("Verification email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("CRITICAL: Failed to send verification email to {}. Error: {}", to, e.getMessage(), e);
            throw e; // Re-throw to allow controller to handle the failure
        }
    }

    public void sendNotification(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            logger.info("Notification email ('{}') sent to: {}", subject, to);
        } catch (Exception e) {
            logger.error("Non-critical: Failed to send notification email to {}. Subject: {}. Error: {}", to, subject, e.getMessage());
        }
    }

    public void sendRescueNotification(String to, String ngoName, String foodItem) {
        sendNotification(to, "Food Rescue Update: Item Rescued", 
            "Great news! The food item '" + foodItem + "' has been successfully rescued by " + ngoName + ".");
    }

    public void sendDeliveryUpdate(String to, String foodItem, String status) {
        sendNotification(to, "Delivery Update: " + foodItem, 
            "The delivery for your food item '" + foodItem + "' is now " + status + ".");
    }
}
