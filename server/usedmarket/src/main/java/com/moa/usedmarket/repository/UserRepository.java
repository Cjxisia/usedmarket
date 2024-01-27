package com.moa.usedmarket.repository;

import com.moa.usedmarket.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByUsername(String username);
    UserEntity findByUsernameAndPassword(String username, String password);
}
