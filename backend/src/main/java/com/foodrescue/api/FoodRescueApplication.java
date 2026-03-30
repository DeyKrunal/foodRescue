package com.foodrescue.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class FoodRescueApplication {
    public static void main(String[] args) {
        SpringApplication.run(FoodRescueApplication.class, args);
    }
}
