import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatArchive_Component() {
  const [username, setUsername] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const usernameFromQuery = queryParams.get('username');

    if (usernameFromQuery) {
      setUsername(usernameFromQuery);

      fetchChatMessages(usernameFromQuery);

      const chatUpdateTimer = setInterval(() => {
        fetchChatMessages(usernameFromQuery);
      }, 500); 

      return () => clearInterval(chatUpdateTimer);
    }
  }, []);

  const fetchChatMessages = async (targetUsername) => {
    try {
      const response = await axios.get(`/api/chat/messages/${targetUsername}`);
      setChatMessages(response.data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const openChatWindow = (chat) => {
    const { sender, postId } = chat;
    
    window.open(`/chat?postAuthor=${sender}&currentUser=${username}&postId=${postId}`, '_blank', 'width=700, height=700');
  };

  // post_id 기준으로 채팅 메시지를 나눠서 출력하는 함수
  const renderChatMessagesByPostId = () => {
    const lastMessagesByPostId = {};
  
    chatMessages.forEach((chat) => {
      const postId = chat.postId;
  
      // Update the last message for each postId
      lastMessagesByPostId[postId] = chat;
    });
  
    return Object.values(lastMessagesByPostId).map((chat, index) => (
      <div key={index} onClick={() => openChatWindow(chat)} style={{ cursor: 'pointer' }}>
        <h3>Post ID: {chat.postId}</h3>
        <div>
          <strong>{chat.sender}:</strong> {chat.message}
        </div>
      </div>
    ));
  };

  return (
    <div>
      <h2>Chat Archive</h2>
      <p>유저네임: {username}</p>

      <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '200px', overflowY: 'auto' }}>
        {renderChatMessagesByPostId()}
      </div>
    </div>
  );
}

export default ChatArchive_Component;
