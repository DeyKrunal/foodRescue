package com.foodrescue.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Request {
    @Id
    private String id;

    @DBRef
    private Donation donation;

    @DBRef
    private User ngo;

    private String status = "PENDING";
    private String message;
    private String donorMessage;
    private LocalDateTime requestedAt = LocalDateTime.now();
    private LocalDateTime respondedAt;
}
