package com.foodrescue.api.repository;

// import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.foodrescue.api.model.Organization;

public interface OrganizationRepository extends MongoRepository<Organization, Long> {
}
