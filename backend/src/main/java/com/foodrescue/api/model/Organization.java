package com.foodrescue.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "organizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Organization {

    @Id
    private String id;   // Mongo uses String (ObjectId)

    private String name;
    private String type; // RESTAURANT, HOTEL, NGO, PARTY_PLOT

    private String address;
    private String contactNumber;

    private String userId; // store reference manually (Mongo style)
}