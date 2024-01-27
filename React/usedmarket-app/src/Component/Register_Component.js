import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

function Register_Component() {
  const [username, setUsername] = useState('');     //유저네임
  const [password, setPassword] = useState('');     //비밀번호
  const [confirmPassword, setConfirmPassword] = useState('');     //비밀번호 확인
  const [message, setMessage] = useState('');     //Modal에 띄워줄 메시지
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);    //네비게이트 구분
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {         //username저장
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {         //password저장
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {    //passowrd확인 저장
    setConfirmPassword(e.target.value);
  };

  const openModal = (msg) => {        //Modal 열때
    setMessage(msg);
    setModalIsOpen(true);
  };

  const closeModal = () => {      //Modal 닫을때
    if (shouldNavigate) {       //shouldNavigate가 1일때만 navigate작동
      navigate('/');
    }
    setShouldNavigate(false);
    setModalIsOpen(false);
  };

  const handleRegister = () => {
    if (!username || !password || !confirmPassword) {
      openModal('모든 입력 필드를 채워주세요.');
      return;
    }

    if (password !== confirmPassword) {
      openModal('비밀번호가 일치하지 않습니다.');
      return;
    }

    axios.post('http://localhost:8080/register', {    //서버의 주소와 포트번호
      username: username,
      password: password,
    })
    .then(response => {
      openModal(`회원가입 성공! ${response.data}`);
      setShouldNavigate(true);
    })
    .catch(error => {
      openModal(`회원가입 실패: ${error.response.data}`);
    });
  };

  return (
    <div>
      <h2>회원가입</h2>
      <label htmlFor="username">아이디:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={handleUsernameChange}
        placeholder="아이디를 입력하세요"
      />

      <label htmlFor="password">비밀번호:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="비밀번호를 입력하세요"
      />

      <label htmlFor="confirmPassword">비밀번호 확인:</label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        placeholder="비밀번호를 다시 입력하세요"
      />

      <button onClick={handleRegister}>가입하기</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Warning Modal"
      >
        <h2>경고</h2>
        <p>{message}</p>
        <button onClick={closeModal}>닫기</button>
      </Modal>
    </div>
  );
}

export default Register_Component;
