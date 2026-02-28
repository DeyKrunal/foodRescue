package com.foodrescue.api.repository;

import com.foodrescue.api.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByNgoId(Long ngoId);

    List<Request> findByDonationDonorId(Long donorId);

    List<Request> findByDonationId(Long donationId);
}
