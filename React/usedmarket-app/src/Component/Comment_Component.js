import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentComponent = ({ parent_component, boardid }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [sessionUsername, setSessionUsername] = useState(null);

  const getSessionUsername = async () => {
    try {
      const response = await axios.get('/get-session-username');
      return response.data;
    } catch (error) {
      console.error('Error fetching session username:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/comment/${parent_component}/${boardid}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const fetchSessionUsername = async () => {
      const username = await getSessionUsername();
      setSessionUsername(username);
    };

    // 초기 로딩 시 한 번 댓글을 불러오고, 그 후 일정 간격으로 주기적으로 댓글을 업데이트
    fetchComments();
    fetchSessionUsername();

    const commentUpdateTimer = setInterval(() => {
      fetchComments();
    }, 500); // 5초마다 업데이트

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearInterval(commentUpdateTimer);
  }, [parent_component, boardid]);

  const handleCommentSubmit = async () => {
    // 새로운 댓글이 비어있는지 확인
    if (!newComment.trim()) {
      alert('댓글 내용을 입력하세요.');
      return;
    }
  
    try {
      // 서버로 데이터를 전송
      const response = await axios.post('/comment', {
        parentcomponent: parent_component,
        boardid: boardid,
        content: newComment,
      });

      console.log('Response from server:', response.data); // 서버 응답 로깅

      // 서버에서 반환된 댓글을 배열에 추가
      setComments([response.data, ...comments]); // 새로운 댓글을 배열 앞에 추가

      // 입력 필드 초기화
      setNewComment('');

      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleCommentUpdate = async (commentId, updatedContent) => {
    try {
      if (updatedContent === null) {
        console.log('댓글 수정이 취소되었습니다.');
        return;
      }
  
      if (!updatedContent.trim()) {
        console.log('댓글 내용이 비어있습니다. 댓글을 업데이트하지 않습니다.');
        return;
      }
  
      const response = await axios.put(`/comment/${commentId}`, {
        content: updatedContent,
      });
  
      console.log('Response from server:', response.data);
  
      setComments(comments.map(comment =>
        comment.commentid === commentId ? { ...comment, content: updatedContent } : comment
      ));
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const response = await axios.delete(`/comment/${commentId}`);
      console.log('Response from server:', response.data);

      // 서버에서 반환된 삭제된 댓글을 배열에서 제거
      setComments(comments.filter(comment => comment.commentid !== commentId));
    } catch (error) {
      console.error('id:', commentId);
      console.error('Error deleting comment:', error);
    }
  };

  
  return (
    <div style={{ textAlign: 'center' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map((comment) => (
          <li key={comment.boardid} style={{ border: '1px solid #ccc', borderRadius: '5px', margin: '10px', padding: '10px' }}>
            <p>작성자: {comment.username}</p>
            <p>내용: {comment.content}</p>
            <p>작성일시: {new Date(comment.datetime).toLocaleString('ko-KR')}</p>
            {String(sessionUsername).trim() === String(comment.username).trim() && (
              <>
                <button onClick={() => handleCommentUpdate(comment.commentid, prompt('댓글 수정', comment.content))}>
                  댓글 수정
                </button>
                <button onClick={() => handleCommentDelete(comment.commentid, comment.username)}>
                  댓글 삭제
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div>
        <textarea
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleCommentSubmit}>댓글 등록</button>
      </div>
    </div>
  );    
};

export default CommentComponent;
