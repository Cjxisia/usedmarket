package com.moa.usedmarket.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "fb_image")
@Data
public class FBImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fb_image_id;

    @Column(name = "image_name")
    private String imageName;

    @ManyToOne
    @JoinColumn(name = "fb_entity_id")
    private FBEntity fbEntity;

    @Override
    public String toString() {
        return "FBImageEntity{" +
                "fb_image_id=" + fb_image_id +
                ", imageName='" + imageName + '\'' +
                '}';
    }
}
