package com.moa.usedmarket.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDto {

    private Long commentid;
    private Long parentcomponent;
    private Long boardid;
    private String content;
    private String username;
    private String datetime;

}
