import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoginComponent from './Login_Component';
import '../css/Pagebutton.css';
import '../css/Trading_Board_Component.css'

function Trading_Board_Component() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [sessionUsername, setSessionUsername] = useState('');

  const fetchSessionUsername = async () => {
    try {
      const response = await axios.get('/get-session-username');
      setSessionUsername(response.data);
    } catch (error) {
      console.error('Error fetching session username:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/tb_list');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchSessionUsername();
      fetchPosts();
    };

    fetchData();

    const postUpdateTimer = setInterval(() => {
      fetchData();
    }, 500);

    return () => clearInterval(postUpdateTimer);
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="flex-container">
        <div className="left-column">
          <h2 id="trading_board_text">거래 게시판</h2>
          {currentPosts.map((post) => (
            <div key={post.tb_entity_id} className="board-section">
              <p>
                <Link to={`/trading_board_page/${post.tb_entity_id}`}>{post.tb_title}</Link>
                {post.tb_content}
                작성자: {post.tb_username}
                작성 시간: {new Date(post.tb_time).toLocaleString()}
              </p>
            </div>
          ))}
  
          <ul className="pagination">
            {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
              <li key={index} className={currentPage === index + 1 ? 'active' : ''}>
                <button onClick={() => paginate(index + 1)}>{index + 1}</button>
              </li>
            ))}
          </ul>
          {sessionUsername !== '' && (
            <Link id="trading_board_write" to="/trading_board_write_page">
              글 작성
            </Link>
          )}
        </div>
  
        <div className="right-column">
          <LoginComponent />
        </div>
      </div>
    </div>
  );
}

export default Trading_Board_Component;
