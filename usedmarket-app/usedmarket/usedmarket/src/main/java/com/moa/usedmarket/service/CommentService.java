package com.moa.usedmarket.service;

import com.moa.usedmarket.dto.CommentDto;
import com.moa.usedmarket.entity.CommentEntity;
import com.moa.usedmarket.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public void addComment(CommentDto commentDto, HttpSession session) {
        CommentEntity commentEntity = new CommentEntity();
        commentEntity.setContent(commentDto.getContent());

        // 세션이 있으면 username 저장, 없으면 "Guest" 저장
        String username = session.getAttribute("username") != null ?
                session.getAttribute("username").toString() : "Guest";
        commentEntity.setUsername(username);

        // CommentDto의 값을 사용하여 CommentEntity를 생성
        commentEntity.setParentcomponent(commentDto.getParentcomponent());
        commentEntity.setBoardid(commentDto.getBoardid());
        commentEntity.setDatetime(LocalDateTime.parse(commentDto.getDatetime()));

        commentRepository.save(commentEntity);
    }

    public List<CommentDto> getComments(Long parent_component, Long board_id) {
        List<CommentEntity> commentEntities = commentRepository.findByParentcomponentAndBoardid(parent_component, board_id);

        return commentEntities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    private CommentDto convertEntityToDto(CommentEntity commentEntity) {
        CommentDto commentDto = new CommentDto();
        commentDto.setCommentid(commentEntity.getCommentid());
        commentDto.setContent(commentEntity.getContent());
        commentDto.setUsername(commentEntity.getUsername());
        commentDto.setDatetime(commentEntity.getDatetime().toString());
        commentDto.setBoardid(commentEntity.getBoardid());
        commentDto.setParentcomponent(commentEntity.getParentcomponent());

        return commentDto;
    }

    public void updateComment(Long commentId, CommentDto commentDto) {
        CommentEntity existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        existingComment.setContent(commentDto.getContent());
        commentRepository.save(existingComment);
    }

    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}

