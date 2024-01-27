package com.moa.usedmarket.service;

import com.moa.usedmarket.dto.UserDto;
import com.moa.usedmarket.entity.UserEntity;
import com.moa.usedmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void saveUser(UserDto userDto) {         // 중복 체크
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }

        UserEntity userEntity = new UserEntity();               // 중복이 아니면 저장
        userEntity.setUsername(userDto.getUsername());
        userEntity.setPassword(userDto.getPassword());

        userRepository.save(userEntity);
    }
}
