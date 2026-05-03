package com.foodrescue.api.repository;

import com.foodrescue.api.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByNgoId(String ngoId);
    java.util.List<User> findByAffiliatedNgoIdAndRoleAndVolunteerStatus(String ngoId, String role, String status);
    java.util.List<User> findByAffiliatedNgoIdAndRole(String ngoId, String role);
}
