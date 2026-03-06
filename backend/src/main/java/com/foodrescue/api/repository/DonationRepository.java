package com.foodrescue.api.repository;

import com.foodrescue.api.model.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import java.util.List;

public interface DonationRepository extends MongoRepository<Donation, String> {
    List<Donation> findByStatus(String status);

    List<Donation> findByDonorId(String donorId);

    // Proximity search: find available donations within a distance from a point
    List<Donation> findByStatusAndLocationNear(String status, Point point, Distance distance);
}
