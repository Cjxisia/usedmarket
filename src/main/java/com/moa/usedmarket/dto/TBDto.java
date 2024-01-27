package com.moa.usedmarket.dto;

import jakarta.persistence.Column;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class TBDto {

    private String tb_entity_id;
    private String tb_title;
    private String tb_content;
    private String placename;
    private String tb_username;
    private String tb_time;
    private List<MultipartFile> tb_images;
    private List<String> old_tb_images;
}

