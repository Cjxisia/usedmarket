package com.moa.usedmarket.service;

import com.moa.usedmarket.dto.TBDto;
import com.moa.usedmarket.entity.TBEntity;
import com.moa.usedmarket.entity.TBImageEntity;
import com.moa.usedmarket.repository.TBRepository;
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
public class TBService {
    private static final Logger logger = LoggerFactory.getLogger(TBService.class);
    @Value("${upload.path}") // application.properties에 저장된 경로
    private String uploadPath;
    private final TBRepository tbRepository;
    public String imn;

    @Autowired
    public TBService(TBRepository tbRepository) {
        this.tbRepository = tbRepository;
    }

    public void saveTBPost(TBDto tbDto, String username) {
        TBEntity tbEntity = convertDtoToEntity(tbDto, username);
        tbRepository.save(tbEntity);
    }

    public List<TBDto> getAllTBPosts() {
        List<TBEntity> tbEntities = tbRepository.findAll();
        return tbEntities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    public TBDto getTBPostById(Long tbId) {
        Optional<TBEntity> tbEntityOptional = tbRepository.findById(tbId);

        if (tbEntityOptional.isPresent()) {
            TBEntity tbEntity = tbEntityOptional.get();
            return convertEntityToDto(tbEntity);
        } else {
            return null;
        }
    }

    public void updateTBPost(Long tbId, TBDto tbDto) {
        Optional<TBEntity> tbEntityOptional = tbRepository.findById(tbId);

        if (tbEntityOptional.isPresent()) {
            TBEntity tbEntity = tbEntityOptional.get();

            tbEntity.setTb_title(tbDto.getTb_title());
            tbEntity.setTb_content(tbDto.getTb_content());
            tbEntity.setPlacename(tbDto.getPlacename());

            // 기존 이미지 삭제
            tbEntity.getTb_images().forEach(image -> image.setTbEntity(null));
            tbEntity.getTb_images().clear();

            // 새로운 이미지 추가

            List<TBImageEntity> oldImages = convertOldImagesToEntities(tbDto.getOld_tb_images(), tbEntity);
            tbEntity.getTb_images().addAll(oldImages);

            List<TBImageEntity> tbImageEntities = convertImagesToEntities(tbDto.getTb_images(), tbEntity);
            tbImageEntities.forEach(image -> image.setTbEntity(tbEntity));
            tbEntity.getTb_images().addAll(tbImageEntities);

            logger.info("Before image update: {}", tbEntity.getTb_images());

            tbRepository.save(tbEntity);
            logger.info("After image update: {}", tbEntity.getTb_images());
        }
    }


    public List<String> getTBPostImagePaths(Long tbId) {
        Optional<TBEntity> tbEntityOptional = tbRepository.findById(tbId);

        if (tbEntityOptional.isPresent()) {
            TBEntity tbEntity = tbEntityOptional.get();
            return convertImagesToPaths(tbEntity.getTb_images());
        } else {
            return Collections.emptyList();
        }
    }

    private TBEntity convertDtoToEntity(TBDto tbDto, String username) {
        TBEntity tbEntity = new TBEntity();
        tbEntity.setTb_username(username == null ? "Guest" : username);
        tbEntity.setTb_title(tbDto.getTb_title());
        tbEntity.setTb_content(tbDto.getTb_content());
        tbEntity.setPlacename(tbDto.getPlacename());
        tbEntity.setTb_time(LocalDateTime.now());

        List<TBImageEntity> tbImageEntities = convertImagesToEntities(tbDto.getTb_images(), tbEntity);
        tbEntity.setTb_images(tbImageEntities);

        return tbEntity;
    }

    private TBDto convertEntityToDto(TBEntity tbEntity) {
        TBDto tbDto = new TBDto();
        tbDto.setTb_entity_id(String.valueOf(tbEntity.getTb_entity_id()));
        tbDto.setTb_title(tbEntity.getTb_title());
        tbDto.setTb_content(tbEntity.getTb_content());
        tbDto.setTb_username(tbEntity.getTb_username());
        tbDto.setTb_time(tbEntity.getTb_time().toString());
        tbDto.setPlacename(tbEntity.getPlacename());

        return tbDto;
    }

    private List<TBImageEntity> convertImagesToEntities(List<MultipartFile> images, TBEntity tbEntity) {
        List<TBImageEntity> tbImageEntities = new ArrayList<>();

        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String imageName = generateRandomImageName(image); // 각 이미지마다 새로운 이미지명 생성
                TBImageEntity tbImageEntity = new TBImageEntity();
                tbImageEntity.setImageName(imageName);
                tbImageEntity.setTbEntity(tbEntity);

                tbImageEntities.add(tbImageEntity);

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

        return tbImageEntities;
    }
    private List<TBImageEntity> convertOldImagesToEntities(List<String> oldImageNames, TBEntity tbEntity) {
        return oldImageNames.stream()
                .map(imageName -> {
                    TBImageEntity tbImageEntity = new TBImageEntity();
                    tbImageEntity.setImageName(imageName);
                    tbImageEntity.setTbEntity(tbEntity);
                    return tbImageEntity;
                })
                .collect(Collectors.toList());
    }
    private List<String> convertImagesToPaths(List<TBImageEntity> images) {
        return images.stream()
                .map(TBImageEntity::getImageName)
                .collect(Collectors.toList());
    }

    private String generateRandomImageName(MultipartFile image) {
        String originalName = image.getOriginalFilename();
        int lastDotIndex = originalName.lastIndexOf(".");
        String extension = (lastDotIndex != -1) ? originalName.substring(lastDotIndex) : "";
        return UUID.randomUUID().toString() + extension;
    }

    public void deleteTBPost(Long tbId) {
        tbRepository.deleteById(tbId);
    }
}