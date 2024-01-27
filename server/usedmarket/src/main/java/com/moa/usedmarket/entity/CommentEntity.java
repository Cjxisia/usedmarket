package com.moa.usedmarket.entity;

import lombok.Data;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@Data
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentid;

    @Column(name = "parentcomponent")
    private Long parentcomponent;

    @Column(name = "boardid")
    private Long boardid;

    @Column(name = "content")
    private String content;

    @Column(name = "username")
    private String username;

    @Column(name = "datetime")
    private LocalDateTime datetime;
}
