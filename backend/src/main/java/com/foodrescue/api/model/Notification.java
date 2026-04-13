package com.foodrescue.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    private String id;

    @DBRef
    private User recipient;

    private String message;
    private String type; // INFO, REQUEST, ALERT, SUCCESS
    private boolean read = false;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
