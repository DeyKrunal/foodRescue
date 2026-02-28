package com.foodrescue.api.config;

import com.foodrescue.api.model.*;
import com.foodrescue.api.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository,
            DonationRepository donationRepository,
            RequestRepository requestRepository) {
        return args -> {
            if (userRepository.count() > 0)
                return;

            // Create Admin
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@foodrescue.com");
            admin.setPassword("admin");
            admin.setRole("ADMIN");
            admin.setVerified(true);
            userRepository.save(admin);

            // Create Donor
            User donor = new User();
            donor.setName("Green Restaurant");
            donor.setEmail("donor@test.com");
            donor.setPassword("password");
            donor.setRole("DONOR");
            donor.setVerified(true);
            userRepository.save(donor);

            // Create NGO
            User ngo = new User();
            ngo.setName("Helping Hands NGO");
            ngo.setEmail("ngo@test.com");
            ngo.setPassword("password");
            ngo.setRole("NGO");
            ngo.setVerified(true);
            userRepository.save(ngo);

            // Create some donations
            Donation d1 = new Donation();
            d1.setFoodItem("Leftover Pasta");
            d1.setQuantity("5kg");
            d1.setDescription("Cooked today, safe to eat.");
            d1.setFoodType("VEG");
            d1.setStatus("AVAILABLE");
            d1.setDonor(donor);
            d1.setCookingTime(LocalDateTime.now().minusHours(2));
            d1.setExpiryTime(LocalDateTime.now().plusHours(4));
            donationRepository.save(d1);

            Donation d2 = new Donation();
            d2.setFoodItem("Bread Rolls");
            d2.setQuantity("20 pcs");
            d2.setDescription("Freshly baked bread rolls.");
            d2.setFoodType("VEG");
            d2.setStatus("AVAILABLE");
            d2.setDonor(donor);
            donationRepository.save(d2);

            // Create a request
            Request r1 = new Request();
            r1.setDonation(d1);
            r1.setNgo(ngo);
            r1.setStatus("PENDING");
            r1.setMessage("We can pick this up in 30 minutes.");
            requestRepository.save(r1);
        };
    }
}
