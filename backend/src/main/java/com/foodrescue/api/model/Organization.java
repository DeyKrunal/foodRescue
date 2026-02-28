package com.foodrescue.api.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "organizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // RESTAURANT, HOTEL, NGO, PARTY_PLOT

    private String address;
    private String contactNumber;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
