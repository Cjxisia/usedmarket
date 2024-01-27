package com.moa.usedmarket.entity;

import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "chat_messages")
@Data
public class ChatEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long postId;

    @Column(nullable = false)
    private String sender;

    @Column(nullable = false)
    private String receiver;

    @Column(nullable = false)
    private String message;

}
