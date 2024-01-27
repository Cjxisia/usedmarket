import React, { useState } from 'react';
import axios from 'axios';

function Free_Board_Write_Component() {
  const [fb_title, setTitle] = useState('');
  const [fb_content, setContent] = useState('');
  const [fb_images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImages = e.target.files;
    setImages((prevImages) => [
      ...prevImages,
      ...(selectedImages ? Array.from(selectedImages) : []),
    ]);
  };

  const handleImageRemove = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const handlePostSubmit = () => {
    // 제목이나 내용이 비어 있는지 확인
    if (!fb_title.trim() || !fb_content.trim()) {
      setMessage('제목과 내용을 입력하세요.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('fb_title', fb_title);
    formData.append('fb_content', fb_content);

    for (let i = 0; i < fb_images.length; i++) {
      if (fb_images[i] !== null) {
        formData.append('fb_images', fb_images[i]);
      }
    }

    axios.post('/fb_write', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }, { withCredentials: true })
      .then(response => {
        setMessage('글 작성 성공');
      })
      .catch(error => {
        console.error('글 작성 실패', error);

        const errorMessage = error.response ? JSON.stringify(error.response.data) : '알 수 없는 오류';
        setMessage(`글 작성 실패: ${errorMessage}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>글 작성 페이지</h1>
      <div>
        <label>제목: </label>
        <input type="text" value={fb_title} onChange={handleTitleChange} />
      </div>
      <div>
        <label>내용: </label>
        <textarea value={fb_content} onChange={handleContentChange} />
      </div>
      <div>
        <label>이미지 업로드: </label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        {fb_images.length > 0 && (
          <div>
            <p>선택된 이미지 미리보기:</p>
            {fb_images.map((image, index) => (
              <div key={index}>
                <img src={URL.createObjectURL(image)} alt="" />
                <button onClick={() => handleImageRemove(index)}>삭제</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <button disabled={loading} onClick={handlePostSubmit}>
          {loading ? '글 작성 중...' : '글 작성'}
        </button>
      </div>
      {message && (
        <div className="write-message">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default Free_Board_Write_Component;
