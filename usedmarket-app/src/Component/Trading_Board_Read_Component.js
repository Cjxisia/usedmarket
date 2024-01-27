import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginComponent from './Login_Component';
import CommentComponent from './Comment_Component';
import Trading_Board_Correction_Component from './Trading_Board_Correction_Component';

function Trading_Board_Read_Component() {
  const { tb_id } = useParams();
  const [post, setPost] = useState({});
  const [imagePaths, setImagePaths] = useState([]);
  const [isEditing, setEditing] = useState(false);
  const [sessionUsername, setSessionUsername] = useState('');
  const navigate = useNavigate();

  const parent_component = 1; // Trading_board 커뮤니티를 나타내는 변수

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/tb/${tb_id}`);
        setPost(response.data);

        const imageResponse = await axios.get(`/tb/img/${tb_id}`);
        setImagePaths(imageResponse.data);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPost();

    const fetchSessionUsername = async () => {
      try {
        const response = await axios.get('/get-session-username'); 
        setSessionUsername(response.data);
        console.log("session:" + response.data);
      } catch (error) {
        console.error('Error fetching session username:', error);
      }
    };

    fetchSessionUsername();
  }, [tb_id]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const handleChatClick = () => {
    window.open(`/chat?postAuthor=${post.tb_username}&currentUser=${sessionUsername}&postId=${tb_id}`, "_blank", "width=700, height=700");
  };


  const handlePostUpdate = () => {
    setEditing(false);
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/tb/${tb_id}`);
        setPost(response.data);
        window.location.reload();
      } catch (error) {
        console.error('Error fetching post details after update:', error);
      }
    };

    fetchPost();
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`/tb/${tb_id}/delete`);
      navigate('/trading_board_page');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '70%', marginRight: '30px' }}>
        {isEditing ? (
          <Trading_Board_Correction_Component
            tb_id={tb_id}
            onCancel={handleCancelEdit}
            onPostUpdate={handlePostUpdate}
          />
        ) : (
          <>
            <h2 style={{ textAlign: 'center' }}>{post.tb_title}</h2>
            <p style={{ textAlign: 'center' }}>작성자: {post.tb_username} 작성 시간: {new Date(post.tb_time).toLocaleString()} 지역명: {post.placename}</p>
            <p style={{ textAlign: 'center' }}>{post.tb_content}</p>
            <div style={{ textAlign: 'center' }}>
              {imagePaths.map((path, index) => (
                <img key={index} src={`${path}`} alt={`Image ${index + 1}`} />
              ))}
            </div>
  
            {String(sessionUsername).trim() === String(post.tb_username).trim() && (
              <div style={{ textAlign: 'center' }}>
                <button onClick={handleEditClick}>수정</button>
                <button onClick={handleDeleteClick}>삭제</button>
              </div>
            )}
  
            {!sessionUsername || post.tb_username === 'Guest' || String(sessionUsername).trim() === String(post.tb_username).trim() ? null : (
              <button onClick={handleChatClick}>채팅하기</button>
            )}
  
            <CommentComponent parent_component={parent_component} boardid={tb_id} />
          </>
        )}
      </div>
  
      <div style={{ width: '30%' }}>
        <LoginComponent />
      </div>
    </div>
  );  
}

export default Trading_Board_Read_Component;