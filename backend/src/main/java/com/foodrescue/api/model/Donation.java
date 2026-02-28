package com.foodrescue.api.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String foodItem;

    @Column(nullable = false)
    private String quantity;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String status = "AVAILABLE"; // AVAILABLE, REQUESTED, RESERVED, COLLECTED, EXPIRED

    @Column(nullable = false)
    private String foodType = "PREPARED"; // VEG, NON_VEG, PREPARED, RAW

    private LocalDateTime cookingTime;
    private LocalDateTime expiryTime;
    private String pickupLocation;
    private String pickupWindow;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor;

    private LocalDateTime createdAt = LocalDateTime.now();
}
