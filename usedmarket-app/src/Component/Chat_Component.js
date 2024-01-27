import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chat_Component() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [postAuthor, setPostAuthor] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [postId, setPostId] = useState('');

  useEffect(() => {
    // URL에서 쿼리 매개변수 추출
    const queryParams = new URLSearchParams(window.location.search);
    const author = queryParams.get('postAuthor');
    const user = queryParams.get('currentUser');
    const id = queryParams.get('postId');

    // State에 값 설정
    setPostAuthor(author);
    setCurrentUser(user);
    setPostId(id);

    // 채팅 기록 불러오기
    fetchChatHistory(id);
    
    const chatUpdateTimer = setInterval(() => {
      fetchChatHistory(id);
    }, 500); // 0.5초마다 업데이트

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearInterval(chatUpdateTimer);
  }, [postId]); // postId가 변경될 때마다 useEffect 실행

  const fetchChatHistory = async (postId) => {
    try {
      const response = await axios.get(`/api/chat/${postId}`);
      setChatHistory(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      // 서버에 메시지 전송
      await axios.post('/api/chat/send', {
        postId,
        sender: currentUser,
        receiver: postAuthor,
        message,
      });

      // 메시지 입력창 비우기
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h2>채팅하기</h2>
      <p>글 작성자: {postAuthor}</p>
      <p>현재 사용자: {currentUser}</p>
      <p>게시물 ID: {postId}</p>

      <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '200px', overflowY: 'auto' }}>
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <strong>{chat.sender}:</strong> {chat.message}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지 입력"
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
    </div>
  );
}

export default Chat_Component;
