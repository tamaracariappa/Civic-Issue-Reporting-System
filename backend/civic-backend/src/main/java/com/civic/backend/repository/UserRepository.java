package com.civic.backend.repository;

import com.civic.backend.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByMobileNumber(String mobileNumber);
}
