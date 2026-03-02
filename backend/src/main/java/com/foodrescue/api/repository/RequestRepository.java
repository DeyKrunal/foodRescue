package com.foodrescue.api.repository;

import com.foodrescue.api.model.Request;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RequestRepository extends MongoRepository<Request, String> {
    List<Request> findByNgoId(String ngoId);

    List<Request> findByDonationDonorId(String donorId);

    List<Request> findByDonationId(String donationId);
}
