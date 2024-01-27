package com.moa.usedmarket.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tb_image")
@Data
public class TBImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tb_image_id;

    @Column(name = "image_name")
    private String imageName;

    @ManyToOne
    @JoinColumn(name = "tb_entity_id")
    private TBEntity tbEntity;

    @Override
    public String toString() {
        return "tbImageEntity{" +
                "tb_image_id=" + tb_image_id +
                ", imageName='" + imageName + '\'' +
                '}';
    }
}
