package com.foodrescue.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donation {
    @Id
    private String id;

    private String foodItem;
    private String quantity;
    private String description;
    private String status = "AVAILABLE";
    private String foodType = "PREPARED";
    private LocalDateTime cookingTime;
    private LocalDateTime expiryTime;
    private String pickupLocation;
    private String pickupWindow;

    // GeoSpatial field for distance filtering [longitude, latitude]
    @org.springframework.data.mongodb.core.index.GeoSpatialIndexed(type = org.springframework.data.mongodb.core.index.GeoSpatialIndexType.GEO_2DSPHERE)
    private double[] location;

    @DBRef
    private User donor;

    private int viewCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
}
