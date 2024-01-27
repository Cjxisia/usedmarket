package com.moa.usedmarket.service;

import com.moa.usedmarket.dto.ChatDto;
import com.moa.usedmarket.entity.ChatEntity;
import com.moa.usedmarket.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    public List<ChatEntity> getChatHistory(Long postId) {
        // 해당 게시물에 대한 채팅 기록을 조회
        return chatRepository.findByPostId(postId);
    }

    public void saveMessage(ChatDto chatDto) {
        // ChatDto를 ChatEntity로 변환 후 저장
        ChatEntity chatEntity = new ChatEntity();
        chatEntity.setPostId(chatDto.getPostId());
        chatEntity.setSender(chatDto.getSender());
        chatEntity.setReceiver(chatDto.getReceiver());
        chatEntity.setMessage(chatDto.getMessage());
        chatRepository.save(chatEntity);
    }

    public List<ChatEntity> getUserChatMessages(String username) {
        // username과 관련된 채팅 메시지들을 가져오는 로직을 구현하세요.
        // 예를 들어, ChatRepository를 이용하여 쿼리를 작성할 수 있습니다.
        return chatRepository.findBySenderOrReceiver(username, username);
    }
}
