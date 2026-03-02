package com.foodrescue.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;

    private String name;

    private String email;

    private String password;

    private String role; // DONOR, NGO, ADMIN

    // Common Profile Fields
    private String mobileNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String profilePhotoUrl;
    private LocalDateTime lastLogin;
    private String accountStatus = "ACTIVE";

    // NGO Specific Fields
    private String ngoName;
    private String authorizedPersonName;
    private Double serviceRadius;
    private String ngoRegistrationNumber;
    private Boolean vehicleAvailable;
    private Integer numberOfVolunteers;
    private String vehicleType;
    private String storageCapacity;
    private String availabilityTiming;
    private String ngoCertificateUrl;

    // Restaurant/Donor Specific Fields
    private String restaurantName;
    private String ownerManagerName;
    private String geoLocation;
    private String foodType; // Veg/Non-Veg/Both
    private String pickupTimeWindow;
    private String averageDonationCapacity;
    private String fssaiLicenseNumber;
    private Boolean refrigerationAvailable;
    private String restaurantLogoUrl;
    private String emergencyContact;

    private boolean verified = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
