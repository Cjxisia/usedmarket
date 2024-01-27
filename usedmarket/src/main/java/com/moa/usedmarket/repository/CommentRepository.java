package com.moa.usedmarket.repository;

import com.moa.usedmarket.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    List<CommentEntity> findByParentcomponentAndBoardid(Long parentComponent, Long boardId);
}
