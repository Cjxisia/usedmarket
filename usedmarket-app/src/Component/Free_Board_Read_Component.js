import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginComponent from './Login_Component';
import CommentComponent from './Comment_Component';
import Free_Board_Correction_Component from './Free_Board_Correction_Component';

function Free_Board_Read_Component() {
  const { fb_id } = useParams();
  const [post, setPost] = useState({});
  const [imagePaths, setImagePaths] = useState([]);
  const [isEditing, setEditing] = useState(false);
  const [sessionUsername, setSessionUsername] = useState('');
  const navigate = useNavigate();

  const parent_component = 0; // Free_board 커뮤니티를 나타내는 변수

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/fb/${fb_id}`);
        setPost(response.data);

        const imageResponse = await axios.get(`/fb/img/${fb_id}`);
        setImagePaths(imageResponse.data);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPost();

    // 세션에서 유저 이름을 가져옴
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
  }, [fb_id]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const handlePostUpdate = () => {
    setEditing(false);
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/fb/${fb_id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post details after update:', error);
      }
    };

    fetchPost();
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`/fb/${fb_id}/delete`);
      navigate('/free_board_page');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '70%', marginRight: '30px' }}>
        {isEditing ? (
          <Free_Board_Correction_Component
            fb_id={fb_id}
            onCancel={handleCancelEdit}
            onPostUpdate={handlePostUpdate}
          />
        ) : (
          <>
            <h2 style={{ textAlign: 'center' }}>{post.fb_title}</h2>
            <p style={{ textAlign: 'center' }}>작성자: {post.fb_username}
            작성 시간: {new Date(post.fb_time).toLocaleString()}</p>
            <p style={{ textAlign: 'center'}}>{post.fb_content}</p>
            <div style={{ textAlign: 'center' }}>
              {imagePaths.map((path, index) => (
                <img key={index} src={`${path}`} alt={`Image ${index + 1}`} />
              ))}
            </div>
  
            {String(sessionUsername).trim() === String(post.fb_username).trim() && (
              <div style={{ textAlign: 'center' }}>
                <button onClick={handleEditClick}>수정</button>
                <button onClick={handleDeleteClick}>삭제</button>
              </div>
            )}
            <CommentComponent parent_component={parent_component} boardid={fb_id} />
          </>
        )}
      </div>
  
      <div style={{ width: '30%' }}>
        <LoginComponent />
      </div>
    </div>
  );    
}

export default Free_Board_Read_Component;
