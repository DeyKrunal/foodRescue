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
            if (!userRepository.findByEmail("admin@foodrescue.com").isPresent()) {
                User admin = new User();
                admin.setName("System Administrator");
                admin.setEmail("admin@foodrescue.com");
                admin.setPassword("admin");
                admin.setRole("ADMIN");
                admin.setVerified(true);
                admin.setMobileNumber("+91 99999 88888");
                userRepository.save(admin);
            }

            // Create Donor
            User donor;
            if (!userRepository.findByEmail("donor@test.com").isPresent()) {
                donor = new User();
                donor.setName("John Baker");
                donor.setEmail("donor@test.com");
                donor.setPassword("password");
                donor.setRole("DONOR");
                donor.setVerified(true);
                donor.setRestaurantName("The Green Bistro");
                donor.setOwnerManagerName("John Baker");
                donor.setMobileNumber("+91 98765 43210");
                donor.setAddress("123 Food Street, MG Road");
                donor.setCity("Ahmedabad");
                donor.setState("Gujarat");
                donor.setPincode("380001");
                donor.setFoodType("Both");
                donor.setFssaiLicenseNumber("FSSAI1234567890");
                donor.setRefrigerationAvailable(true);
                donor = userRepository.save(donor);
            } else {
                donor = userRepository.findByEmail("donor@test.com").get();
            }

            // Create NGO
            User ngo;
            if (!userRepository.findByEmail("ngo@test.com").isPresent()) {
                ngo = new User();
                ngo.setName("Sarah Help");
                ngo.setEmail("ngo@test.com");
                ngo.setPassword("password");
                ngo.setRole("NGO");
                ngo.setVerified(false);
                ngo.setNgoName("Helping Hearts Foundation");
                ngo.setAuthorizedPersonName("Sarah Help");
                ngo.setMobileNumber("+91 91234 56789");
                ngo.setAddress("45 Charity Lane");
                ngo.setCity("Ahmedabad");
                ngo.setState("Gujarat");
                ngo.setPincode("380009");
                ngo.setNgoRegistrationNumber("NGO-AHM-2024-001");
                ngo.setServiceRadius(15.0);
                ngo.setVehicleAvailable(true);
                ngo = userRepository.save(ngo);
            } else {
                ngo = userRepository.findByEmail("ngo@test.com").get();
            }

            if (donationRepository.count() == 0) {
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
            }
        };
    }
}
