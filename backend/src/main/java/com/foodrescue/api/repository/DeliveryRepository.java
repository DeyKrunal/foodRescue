package com.foodrescue.api.repository;

import com.foodrescue.api.model.Delivery;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends MongoRepository<Delivery, String> {
    List<Delivery> findByVolunteerId(String volunteerId);
    List<Delivery> findByStatus(String status);
    Optional<Delivery> findByRequestId(String requestId);
    List<Delivery> findByRequestDonationDonorId(String donorId);
    List<Delivery> findByRequestNgoId(String ngoId);
}
