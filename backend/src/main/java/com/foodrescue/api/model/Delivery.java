package com.foodrescue.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    @Id
    private String id;

    @DBRef
    private Request request;

    @DBRef
    private User volunteer;

    private String status = "PENDING"; // PENDING, ASSIGNED, OTP_VERIFIED, IN_TRANSIT, DELIVERED

    private String pickupOtp;

    private boolean ngoVerified = false;

    private double[] currentCoordinates; // [longitude, latitude] for Porter-like tracking
    
    private String pickupPoint;
    private String deliveryPoint;
    
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
