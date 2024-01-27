import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoginComponent from './Login_Component';
import '../css/Pagebutton.css';
import '../css/Main_Component.css'

function Main_Component() {
  const [freeBoardPosts, setFreeBoardPosts] = useState([]);
  const [tradingBoardPosts, setTradingBoardPosts] = useState([]);
  const [freeBoardCurrentPage, setFreeBoardCurrentPage] = useState(1);
  const [tradingBoardCurrentPage, setTradingBoardCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const fetchFreeBoard = async () => {
    try {
      const response = await axios.get('/fb_list');
      setFreeBoardPosts(response.data);
    } catch (error) {
      console.error('Error fetching free board posts:', error);
    }
  };

  const fetchTradingBoard = async () => {
    try {
      const response = await axios.get('/tb_list');
      setTradingBoardPosts(response.data);
    } catch (error) {
      console.error('Error fetching trading board posts:', error);
    }
  };

  useEffect(() => {
    fetchFreeBoard();
    fetchTradingBoard();
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  const paginateFreeBoard = (pageNumber) => {
    setFreeBoardCurrentPage(pageNumber);
  };

  const paginateTradingBoard = (pageNumber) => {
    setTradingBoardCurrentPage(pageNumber);
  };

  const freeBoardIndexOfLastPost = freeBoardCurrentPage * postsPerPage;
  const freeBoardIndexOfFirstPost = freeBoardIndexOfLastPost - postsPerPage;
  const freeBoardCurrentPosts = freeBoardPosts.slice(freeBoardIndexOfFirstPost, freeBoardIndexOfLastPost);

  const tradingBoardIndexOfLastPost = tradingBoardCurrentPage * postsPerPage;
  const tradingBoardIndexOfFirstPost = tradingBoardIndexOfLastPost - postsPerPage;
  const tradingBoardCurrentPosts = tradingBoardPosts.slice(tradingBoardIndexOfFirstPost, tradingBoardIndexOfLastPost);

  return (
    <div className="container">
      <div className="boards">
        <h1 id="free_board_text">자유 게시판</h1>
        <div id="free_board_space">
          {freeBoardCurrentPosts.map((post) => (
            <p key={post.fb_entity_id}>
              <Link to={`/free_board_page/${post.fb_entity_id}`}>{post.fb_title}</Link>
              작성자: {post.fb_username}
              작성 시간: {new Date(post.fb_time).toLocaleString()}
            </p>
          ))}
        </div>
        <Link id="free_board_more" to="/free_board_page">
          더보기
        </Link>

        <h1 id="sale_board_text">판매 게시판</h1>
        <div id="sale_board_space">
          {tradingBoardCurrentPosts.map((post) => (
            <p key={post.tb_entity_id}>
              <Link to={`/trading_board_page/${post.tb_entity_id}`}>{post.tb_title}</Link>
              작성자: {post.tb_username}
              작성 시간: {new Date(post.tb_time).toLocaleString()}
            </p>
          ))}
        </div>
        <Link id="sale_board_more" to="/trading_board_page">
          더보기
        </Link>
      </div>
      <LoginComponent />
    </div>
  );
}

export default Main_Component;
