package com.moa.usedmarket.repository;

import com.moa.usedmarket.entity.ChatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<ChatEntity, Long> {
    List<ChatEntity> findByPostId(Long postId);
    List<ChatEntity> findBySenderOrReceiver(String sender, String receiver);
}
