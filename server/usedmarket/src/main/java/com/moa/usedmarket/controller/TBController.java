package com.moa.usedmarket.controller;

import com.moa.usedmarket.dto.TBDto;
import com.moa.usedmarket.service.TBService;
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
public class TBController {

    private final TBService tbService;
    private static final Logger logger = LoggerFactory.getLogger(TBController.class);

    @Autowired
    public TBController(TBService tbService) {
        this.tbService = tbService;
    }

    @PostMapping("/tb_write")           //작성
    public ResponseEntity<String> writeTBPost(@RequestParam("tb_title") String tbTitle,
                                              @RequestParam("tb_content") String tbContent,
                                              @RequestParam("place_name") String placename,
                                              @RequestParam(value = "tb_images", required = false) List<MultipartFile> tbImages,
                                              HttpSession session) {
        try {
            TBDto tbDto = new TBDto();
            tbDto.setTb_title(tbTitle);
            tbDto.setTb_content(tbContent);
            tbDto.setPlacename(placename);
            tbDto.setTb_images(tbImages);

            // 세션에서 사용자 이름 가져오기
            String username = (String) session.getAttribute("username");

            tbService.saveTBPost(tbDto, username);
            System.out.println("유저명: " + username);
            return ResponseEntity.ok("글 작성 성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("글 작성 실패: " + e.getMessage());
        }
    }

    @GetMapping("/tb_list")                 //Tb(Free_Board) 정보 반환
    public ResponseEntity<List<TBDto>> getTBPosts() {
        List<TBDto> posts = tbService.getAllTBPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/tb/{tb_id}")              //id에 일치하는 TB정보를 반환
    public ResponseEntity<TBDto> getTBPostById(@PathVariable("tb_id") Long tbId) {
        TBDto tbDto = tbService.getTBPostById(tbId);

        if (tbDto != null) {
            return ResponseEntity.ok(tbDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("tb/img/{tb_id}")           //id에 일치하는 이미지 정보 반환
    public ResponseEntity<List<String>> getTBPostImages(@PathVariable("tb_id") Long tbId) {
        List<String> imagePaths = tbService.getTBPostImagePaths(tbId);

        if (!imagePaths.isEmpty()) {
            List<String> fullImagePaths = imagePaths.stream()
                    .map(imagePath -> "/static/images/" + imagePath)  // static 경로를 추가하여 전체 이미지 경로 생성
                    .collect(Collectors.toList());

            return ResponseEntity.ok(fullImagePaths);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/tb/{tb_id}/update")
    public ResponseEntity<String> updateTBPost(
            @PathVariable("tb_id") Long tbId,
            @RequestParam("tb_title") String tbTitle,
            @RequestParam("tb_content") String tbContent,
            @RequestParam("placename") String placename,
            @RequestParam(value = "old_tb_images", required = false) List<String> originalImageNames,
            @RequestParam(value = "tb_images", required = false) List<MultipartFile> newImages
    ) {
        try {
            TBDto tbDto = new TBDto();
            tbDto.setTb_title(tbTitle);
            tbDto.setTb_content(tbContent);
            tbDto.setPlacename(placename);

            // Null 체크 후 빈 리스트로 초기화
            tbDto.setOld_tb_images(originalImageNames != null ? originalImageNames : new ArrayList<>());
            tbDto.setTb_images(newImages != null ? newImages : new ArrayList<>());

            logger.info("Controller TB post with ID: {}", tbId);
            logger.info("Controller Title: {}", tbDto.getTb_title());
            logger.info("placename : ", tbDto.getPlacename());
            logger.info("Controller Content: {}", tbDto.getTb_content());

            // 기존 이미지 이름 출력
            for (String imageName : tbDto.getOld_tb_images()) {
                logger.info("Original Image Name: {}", imageName);
            }

            // 새로운 이미지 출력
            for (MultipartFile image : tbDto.getTb_images()) {
                logger.info("New Image: Name={}, Type={}, Size={}", image.getOriginalFilename(), image.getContentType(), image.getSize());
            }

            tbService.updateTBPost(tbId, tbDto);

            return ResponseEntity.ok("글 수정 성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("글 수정 실패: " + e.getMessage());
        }
    }
    @DeleteMapping("/tb/{tb_id}/delete")
    public ResponseEntity<String> deleteTBPost(@PathVariable("tb_id") Long tbId) {
        try {
            tbService.deleteTBPost(tbId);
            return ResponseEntity.ok("글 삭제 성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("글 삭제 실패: " + e.getMessage());
        }
    }
}
