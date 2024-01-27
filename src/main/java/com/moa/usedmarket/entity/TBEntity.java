package com.moa.usedmarket.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tb_entity")
@Data
public class TBEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tb_entity_id;

    @Column(name = "tb_title")
    private String tb_title;

    @Column(name = "tb_content")
    private String tb_content;

    @Column(name = "placename")
    private String placename;

    @Column(name = "tb_user_name")
    private String tb_username;

    @OneToMany(mappedBy = "tbEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TBImageEntity> tb_images;

    @Column(name = "tb_time")
    private LocalDateTime tb_time;
}

