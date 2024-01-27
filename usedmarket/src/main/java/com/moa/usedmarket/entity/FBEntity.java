package com.moa.usedmarket.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "fb_entity")
@Data
public class FBEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fb_entity_id;

    @Column(name = "fb_title")
    private String fb_title;

    @Column(name = "fb_content")
    private String fb_content;

    @Column(name = "fb_user_name")
    private String fb_username;

    @OneToMany(mappedBy = "fbEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FBImageEntity> fb_images;

    @Column(name = "fb_time")
    private LocalDateTime fb_time;
}

