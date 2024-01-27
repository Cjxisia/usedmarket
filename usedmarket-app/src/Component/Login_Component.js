import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../css/Login_Component.css'

function Login_Component() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { isLoggedIn, username: authUsername, login, logout } = useAuth();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/get-session-username', { withCredentials: true });
        const sessionUsername = response.data;

        if (sessionUsername) {
          login(sessionUsername);
        }
      } catch (error) {
        console.error('세션 확인 실패:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setMessage('아이디와 비밀번호를 입력하세요.');
      return;
    }

    try {
      const response = await axios.post('/login', {
        username: username,
        password: password
      },
      { withCredentials: true });

      setMessage(response.data);
      login(username);
    } catch (error) {
      console.error('로그인 실패:', error);
      setMessage(`로그인 실패: ${error.response ? error.response.data : '서버 에러'}`);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      setMessage('로그아웃 성공');
      logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
      setMessage(`로그아웃 실패: ${error.response ? error.response.data : '서버 에러'}`);
    }
  };

  const handleChatClick = () => {
    window.open(`/chatarchive?username=${authUsername}`, "_blank", "width=700, height=700");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        {isLoggedIn ? (
          <div className="logged-in-container">
            <p>안녕하세요, {authUsername}님!</p>
            <button onClick={handleLogout}>로그아웃</button>
            <button onClick={handleChatClick}>채팅목록</button>
          </div>
        ) : (
          <div>
            <div>
              <label>Username: </label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label>Password: </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <button onClick={handleLogin}>로그인</button>
            </div>
            <Link to="/register_page">회원가입</Link>
          </div>
        )}
        {message && (
          <div className="login-message">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login_Component;
