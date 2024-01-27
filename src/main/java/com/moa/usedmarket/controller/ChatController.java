package com.moa.usedmarket.controller;

import com.moa.usedmarket.dto.ChatDto;
import com.moa.usedmarket.entity.ChatEntity;
import com.moa.usedmarket.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/{postId}")
    public ResponseEntity<List<ChatEntity>> getChatHistory(@PathVariable(name = "postId") Long postId) {
        List<ChatEntity> chatHistory = chatService.getChatHistory(postId);
        return ResponseEntity.ok(chatHistory);
    }

    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestBody ChatDto chatDto) {
        chatService.saveMessage(chatDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/messages/{username}")
    public ResponseEntity<List<ChatEntity>> getUserChatMessages(@PathVariable(name = "username") String username) {
        List<ChatEntity> userChatMessages = chatService.getUserChatMessages(username);
        return ResponseEntity.ok(userChatMessages);
    }
}
