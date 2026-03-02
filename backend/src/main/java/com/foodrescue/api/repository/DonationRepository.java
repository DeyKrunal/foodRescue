package com.foodrescue.api.repository;

import com.foodrescue.api.model.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DonationRepository extends MongoRepository<Donation, String> {
    List<Donation> findByStatus(String status);

    List<Donation> findByDonorId(String donorId);
}
