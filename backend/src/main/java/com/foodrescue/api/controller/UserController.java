package com.foodrescue.api.controller;

import com.foodrescue.api.model.User;
import com.foodrescue.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User userData) {
        return userRepository.findById(id).map(user -> {
            user.setName(userData.getName());
            user.setMobileNumber(userData.getMobileNumber());
            user.setAddress(userData.getAddress());
            user.setCity(userData.getCity());
            user.setState(userData.getState());
            user.setPincode(userData.getPincode());

            if (userData.getRestaurantName() != null) user.setRestaurantName(userData.getRestaurantName());
            if (userData.getNgoName() != null) user.setNgoName(userData.getNgoName());
            if (userData.getAuthorizedPersonName() != null) user.setAuthorizedPersonName(userData.getAuthorizedPersonName());

            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
