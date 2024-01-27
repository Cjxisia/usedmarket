package com.moa.usedmarket.dto;

import jakarta.persistence.Column;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class FBDto {

    private String fb_entity_id;
    private String fb_title;
    private String fb_content;
    private String fb_username;
    private String fb_time;
    private List<MultipartFile> fb_images;
    private List<String> old_fb_images;
}

