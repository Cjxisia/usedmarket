package com.moa.usedmarket.controller;

import com.moa.usedmarket.dto.FBDto;
import com.moa.usedmarket.service.FBService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpSession;


import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class FBController {

    private final FBService fbService;
    private static final Logger logger = LoggerFactory.getLogger(TBController.class);

    @Autowired
    public FBController(FBService fbService) {
        this.fbService = fbService;
    }

    @PostMapping("/fb_write")           //작성
    public ResponseEntity<String> writeFBPost(@RequestParam("fb_title") String fbTitle,
                                              @RequestParam("fb_content") String fbContent,
                                              @RequestParam(value = "fb_images", required = false) List<MultipartFile> fbImages,
                                              HttpSession session) {
        try {
            FBDto fbDto = new FBDto();
            fbDto.setFb_title(fbTitle);
            fbDto.setFb_content(fbContent);
            fbDto.setFb_images(fbImages);

            // 세션에서 사용자 이름 가져오기
            String username = (String) session.getAttribute("username");

            fbService.saveFBPost(fbDto, username);
            System.out.println("유저명: " + username);
            return ResponseEntity.ok("글 작성 성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("글 작성 실패: " + e.getMessage());
        }
    }

    @GetMapping("/fb_list")                 //Fb(Free_Board) 정보 반환
    public ResponseEntity<List<FBDto>> getFBPosts() {
        List<FBDto> posts = fbService.getAllFBPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/fb/{fb_id}")              //id에 일치하는 FB정보를 반환
    public ResponseEntity<FBDto> getFBPostById(@PathVariable("fb_id") Long fbId) {
        FBDto fbDto = fbService.getFBPostById(fbId);

        if (fbDto != null) {
            return ResponseEntity.ok(fbDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("fb/img/{fb_id}")           //id에 일치하는 이미지 정보 반환
    public ResponseEntity<List<String>> getFBPostImages(@PathVariable("fb_id") Long fbId) {
        List<String> imagePaths = fbService.getFBPostImagePaths(fbId);

        if (!imagePaths.isEmpty()) {
            List<String> fullImagePaths = imagePaths.stream()
                    .map(imagePath -> "/static/images/" + imagePath)  // static 경로를 추가하여 전체 이미지 경로 생성
                    .collect(Collectors.toList());

            return ResponseEntity.ok(fullImagePaths);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/fb/{fb_id}/update")
    public ResponseEntity<String> updateFBPost(
            @PathVariable("fb_id") Long fbId,
            @RequestParam("fb_title") String fbTitle,
            @RequestParam("fb_content") String fbContent,
            @RequestParam(value = "old_fb_images", required = false) List<String> originalImageNames,
            @RequestParam(value = "fb_images", required = false) List<MultipartFile> newImages
    ) {
        try {
            FBDto fbDto = new FBDto();
            fbDto.setFb_title(fbTitle);
            fbDto.setFb_content(fbContent);

            // Null 체크 후 빈 리스트로 초기화
            fbDto.setOld_fb_images(originalImageNames != null ? originalImageNames : new ArrayList<>());
            fbDto.setFb_images(newImages != null ? newImages : new ArrayList<>());

            logger.info("Controller FB post with ID: {}", fbId);
            logger.info("Controller Title: {}", fbDto.getFb_title());
            logger.info("Controller Content: {}", fbDto.getFb_content());

            // 기존 이미지 이름 출력
            for (String imageName : fbDto.getOld_fb_images()) {
                logger.info("Original Image Name: {}", imageName);
            }

            // 새로운 이미지 출력
            for (MultipartFile image : fbDto.getFb_images()) {
                logger.info("New Image: Name={}, Type={}, Size={}", image.getOriginalFilename(), image.getContentType(), image.getSize());
            }

            fbService.updateFBPost(fbId, fbDto);

            return ResponseEntity.ok("글 수정 성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("글 수정 실패: " + e.getMessage());
        }
    }
    @DeleteMapping("/fb/{fb_id}/delete")
    public ResponseEntity<String> deleteFBPost(@PathVariable("fb_id") Long fbId) {
        try {
            fbService.deleteFBPost(fbId);
            return ResponseEntity.ok("글 삭제 성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("글 삭제 실패: " + e.getMessage());
        }
    }
}
