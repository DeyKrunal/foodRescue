package com.foodrescue.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("FoodRescue - Email Verification");
        message.setText("Your verification code is: " + code + "\n\nThis code will expire in 15 minutes.");
        mailSender.send(message);
    }

    public void sendRescueNotification(String to, String ngoName, String foodItem) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Food Rescue Update: Item Rescued");
        message.setText("Great news! The food item '" + foodItem + "' has been successfully rescued by " + ngoName
                + ".\n\nThank you for being part of the community.");
        mailSender.send(message);
    }
}
