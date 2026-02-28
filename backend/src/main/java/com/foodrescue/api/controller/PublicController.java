package com.foodrescue.api.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Arrays;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {

    @GetMapping("/impact-stats")
    public Map<String, Object> getImpactStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("mealsServed", 12500);
        stats.put("foodSavedKg", 5200);
        stats.put("partnersCount", 150);
        return stats;
    }

    @GetMapping("/testimonials")
    public List<Map<String, String>> getTestimonials() {
        Map<String, String> t1 = new HashMap<>();
        t1.put("name", "John Doe");
        t1.put("role", "Restaurant Owner");
        t1.put("message", "FoodRescue made it so easy for us to donate excess food.");

        Map<String, String> t2 = new HashMap<>();
        t2.put("name", "Jane Smith");
        t2.put("role", "NGO Director");
        t2.put("message", "We've been able to reach hundreds of people thanks to this platform.");

        return Arrays.asList(t1, t2);
    }
}
