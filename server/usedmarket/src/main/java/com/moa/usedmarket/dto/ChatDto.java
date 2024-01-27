package com.moa.usedmarket.dto;

import lombok.Data;

@Data
public class ChatDto {

    private Long postId;
    private String sender;
    private String receiver;
    private String message;
}
