package com.caetano.gpu_radar_api.repository;

import com.caetano.gpu_radar_api.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long>{
    Optional<UserAccount> findByEmail(String email);
    boolean existsByEmail(String email);
}
