package com.moa.usedmarket.controller;

import com.moa.usedmarket.entity.UserEntity;
import com.moa.usedmarket.repository.UserRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
public class LoginController {

    private final UserRepository userRepository;

    @Autowired
    public LoginController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginForm loginForm, HttpSession session) {
        String username = loginForm.getUsername();
        String password = loginForm.getPassword();

        try {
            UserEntity userEntity = userRepository.findByUsernameAndPassword(username, password);

            if (userEntity != null) {
                System.out.println("Login successful for user: " + username);

                session.setAttribute("username", username);
                String sessionId = session.getId();
                System.out.println("Session user in controller: " + session.getAttribute("username"));
                return ResponseEntity.ok("로그인 성공" + username + ", Session ID: " + sessionId);
            } else {
                return ResponseEntity.badRequest().body("Login failed: Invalid username or password");
            }
        } catch (Exception e) {
            System.out.println("Login failed due to an error: " + e.getMessage());
            return ResponseEntity.status(500).body("Login failed due to an error: " + e.getMessage());
        }
    }

    // 로그인 폼을 받기 위한 클래스
    @Getter
    public static class LoginForm {
        private String username;
        private String password;


        public void setUsername(String username) {
            this.username = username;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    @GetMapping("/get-session-username")
    public String getSessionUsername(HttpSession session) {
        String username = (String) session.getAttribute("username");

        return username;
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        try {
            session.invalidate();
            return ResponseEntity.ok("로그아웃 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("로그아웃 실패: " + e.getMessage());
        }
    }
}
