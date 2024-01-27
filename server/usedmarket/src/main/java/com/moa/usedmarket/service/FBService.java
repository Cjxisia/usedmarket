package com.moa.usedmarket.service;

import com.moa.usedmarket.dto.FBDto;
import com.moa.usedmarket.entity.FBEntity;
import com.moa.usedmarket.entity.FBImageEntity;
import com.moa.usedmarket.repository.FBRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FBService {
    private static final Logger logger = LoggerFactory.getLogger(FBService.class);
    @Value("${upload.path}") // application.properties에 저장된 경로
    private String uploadPath;
    private final FBRepository fbRepository;
    public String imn;

    @Autowired
    public FBService(FBRepository fbRepository) {
        this.fbRepository = fbRepository;
    }

    public void saveFBPost(FBDto fbDto, String username) {
        FBEntity fbEntity = convertDtoToEntity(fbDto, username);
        fbRepository.save(fbEntity);
    }

    public List<FBDto> getAllFBPosts() {
        List<FBEntity> fbEntities = fbRepository.findAll();
        return fbEntities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    public FBDto getFBPostById(Long fbId) {
        Optional<FBEntity> fbEntityOptional = fbRepository.findById(fbId);

        if (fbEntityOptional.isPresent()) {
            FBEntity fbEntity = fbEntityOptional.get();
            return convertEntityToDto(fbEntity);
        } else {
            return null;
        }
    }

    public void updateFBPost(Long fbId, FBDto fbDto) {
        Optional<FBEntity> fbEntityOptional = fbRepository.findById(fbId);

        if (fbEntityOptional.isPresent()) {
            FBEntity fbEntity = fbEntityOptional.get();

            fbEntity.setFb_title(fbDto.getFb_title());
            fbEntity.setFb_content(fbDto.getFb_content());

            // 기존 이미지 삭제
            fbEntity.getFb_images().forEach(image -> image.setFbEntity(null));
            fbEntity.getFb_images().clear();

            // 새로운 이미지 추가

            List<FBImageEntity> oldImages = convertOldImagesToEntities(fbDto.getOld_fb_images(), fbEntity);
            fbEntity.getFb_images().addAll(oldImages);

            List<FBImageEntity> fbImageEntities = convertImagesToEntities(fbDto.getFb_images(), fbEntity);
            fbImageEntities.forEach(image -> image.setFbEntity(fbEntity));
            fbEntity.getFb_images().addAll(fbImageEntities);

            logger.info("Before image update: {}", fbEntity.getFb_images());

            fbRepository.save(fbEntity);
            logger.info("After image update: {}", fbEntity.getFb_images());
        }
    }


    public List<String> getFBPostImagePaths(Long fbId) {
        Optional<FBEntity> fbEntityOptional = fbRepository.findById(fbId);

        if (fbEntityOptional.isPresent()) {
            FBEntity fbEntity = fbEntityOptional.get();
            return convertImagesToPaths(fbEntity.getFb_images());
        } else {
            return Collections.emptyList();
        }
    }

    private FBEntity convertDtoToEntity(FBDto fbDto, String username) {
        FBEntity fbEntity = new FBEntity();
        fbEntity.setFb_username(username == null ? "Guest" : username);
        fbEntity.setFb_title(fbDto.getFb_title());
        fbEntity.setFb_content(fbDto.getFb_content());
        fbEntity.setFb_time(LocalDateTime.now());

        List<FBImageEntity> fbImageEntities = convertImagesToEntities(fbDto.getFb_images(), fbEntity);
        fbEntity.setFb_images(fbImageEntities);

        return fbEntity;
    }

    private FBDto convertEntityToDto(FBEntity fbEntity) {
        FBDto fbDto = new FBDto();
        fbDto.setFb_entity_id(String.valueOf(fbEntity.getFb_entity_id()));
        fbDto.setFb_title(fbEntity.getFb_title());
        fbDto.setFb_content(fbEntity.getFb_content());
        fbDto.setFb_username(fbEntity.getFb_username());
        fbDto.setFb_time(fbEntity.getFb_time().toString());

        return fbDto;
    }

    private List<FBImageEntity> convertImagesToEntities(List<MultipartFile> images, FBEntity fbEntity) {
        List<FBImageEntity> fbImageEntities = new ArrayList<>();

        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String imageName = generateRandomImageName(image); // 각 이미지마다 새로운 이미지명 생성
                FBImageEntity fbImageEntity = new FBImageEntity();
                fbImageEntity.setImageName(imageName);
                fbImageEntity.setFbEntity(fbEntity);

                fbImageEntities.add(fbImageEntity);

                // 이미지를 저장
                Path imagePath = Path.of(uploadPath, imageName);
                System.out.println("Entitesimagename:" + imageName);

                try {
                    Files.copy(image.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return fbImageEntities;
    }
    private List<FBImageEntity> convertOldImagesToEntities(List<String> oldImageNames, FBEntity fbEntity) {
        return oldImageNames.stream()
                .map(imageName -> {
                    FBImageEntity fbImageEntity = new FBImageEntity();
                    fbImageEntity.setImageName(imageName);
                    fbImageEntity.setFbEntity(fbEntity);
                    return fbImageEntity;
                })
                .collect(Collectors.toList());
    }
    private List<String> convertImagesToPaths(List<FBImageEntity> images) {
        return images.stream()
                .map(FBImageEntity::getImageName)
                .collect(Collectors.toList());
    }

    private String generateRandomImageName(MultipartFile image) {
        String originalName = image.getOriginalFilename();
        int lastDotIndex = originalName.lastIndexOf(".");
        String extension = (lastDotIndex != -1) ? originalName.substring(lastDotIndex) : "";
        return UUID.randomUUID().toString() + extension;
    }

    public void deleteFBPost(Long fbId) {
        fbRepository.deleteById(fbId);
    }
}