import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoginComponent from './Login_Component';
import '../css/Pagebutton.css';
import '../css/Free_Board_Component.css'

function Free_Board_Component() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/fb_list');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();

    const postUpdateTimer = setInterval(() => {
      fetchPosts();
    }, 500);

    return () => clearInterval(postUpdateTimer);
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="flex-container">
        <div className="left-column">
          <h2>자유 게시판</h2>
          {currentPosts.map(post => (
            <div key={post.fb_entity_id} className="board-section">
              <p>
                <Link to={`/free_board_page/${post.fb_entity_id}`}>{post.fb_title}</Link>
                {post.fb_content}
                작성자: {post.fb_username}
                작성 시간: {new Date(post.fb_time).toLocaleString()}
              </p>
            </div>
          ))}

          <ul className="pagination">
            {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
              <li key={index} className={currentPage === index + 1 ? 'active' : ''}>
                <button onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
          <Link id="board_write" to="/free_board_write_page">글 작성</Link>
        </div>

        <div className="right-column">
          <LoginComponent />
        </div>
      </div>
    </div>
  );
}

export default Free_Board_Component;
