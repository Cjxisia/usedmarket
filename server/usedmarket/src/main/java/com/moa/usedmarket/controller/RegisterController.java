package com.moa.usedmarket.controller;

import com.moa.usedmarket.dto.UserDto;
import com.moa.usedmarket.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegisterController {

    private final UserService userService;

    @Autowired
    public RegisterController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDto userdto) {
        try {
            userService.saveUser(userdto);
            String username = userdto.getUsername();
            return ResponseEntity.ok("User registered successfully. Welcome, " + username + "!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("중복되는 아이디가 존재합니다!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("505 예기치 못한 오류입니다");
        }
    }
}
