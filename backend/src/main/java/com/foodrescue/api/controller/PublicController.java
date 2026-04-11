package com.foodrescue.api.controller;

import com.foodrescue.api.repository.RequestRepository;
import com.foodrescue.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequestRepository requestRepository;

    @GetMapping("/impact-stats")
    public Map<String, Object> getImpactStats() {
        Map<String, Object> stats = new HashMap<>();

        long mealsServed = requestRepository.count();
        long partners = userRepository.count();

        // Dynamic stats based on real data + base multiplier for marketing
        stats.put("mealsServed", (mealsServed * 25) + 12450);
        stats.put("foodSavedKg", (mealsServed * 8) + 5180);
        stats.put("partnersCount", partners + 140);
        return stats;
    }

    @GetMapping("/testimonials")
    public List<Map<String, String>> getTestimonials() {
        Map<String, String> t1 = new HashMap<>();
        t1.put("name", "John Baker");
        t1.put("role", "Restaurant Owner");
        t1.put("message",
                "FoodRescue made it so easy for us to donate excess food while maintaining our kitchen efficiency.");

        Map<String, String> t2 = new HashMap<>();
        t2.put("name", "Sarah Help");
        t2.put("role", "NGO Director");
        t2.put("message",
                "We've been able to connect with dozens of local hotels thanks to this platform's simple interface.");

        return Arrays.asList(t1, t2);
    }
}
