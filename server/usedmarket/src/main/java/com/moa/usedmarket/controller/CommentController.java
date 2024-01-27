package com.moa.usedmarket.controller;

import com.moa.usedmarket.dto.CommentDto;
import com.moa.usedmarket.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

import java.time.LocalDateTime;
import java.util.List;

@RestController
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/comment")
    public String addComment(@RequestBody CommentDto commentDto, HttpSession session) {
        commentDto.setDatetime(LocalDateTime.now().toString());
        commentService.addComment(commentDto, session);
        return "댓글이 성공적으로 등록되었습니다.";
    }

    @GetMapping("/comment/{parent_component}/{boardid}")
    public List<CommentDto> getComments(@PathVariable(name = "parent_component") Long parent_component,
                                        @PathVariable(name = "boardid") Long boardid) {
        return commentService.getComments(parent_component, boardid);
    }

    @PutMapping("/comment/{commentId}")
    public String updateComment(@PathVariable (name = "commentId") Long commentId, @RequestBody CommentDto commentDto) {
        commentService.updateComment(commentId, commentDto);
        return "댓글이 성공적으로 수정되었습니다.";
    }

    @DeleteMapping("/comment/{commentId}")
    public String deleteComment(@PathVariable ( name = "commentId") Long commentId) {
        System.out.println("아이디:" + commentId);
        commentService.deleteComment(commentId);
        return "댓글이 성공적으로 삭제되었습니다.";
    }
}