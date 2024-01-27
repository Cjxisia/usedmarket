import React, { useState } from 'react';
import axios from 'axios';
import KakaoMapComponent from './KakaoMapComponent';

function Trading_Board_Write_Component() {
  const [tb_title, setTitle] = useState('');
  const [tb_content, setContent] = useState('');
  const [tb_images, setImages] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const apiKey = '9205f8c2a175502c16ee84d9ad8b0a8d'; // 여기에 카카오 API 키를 넣어주세요

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

  const handlePostSubmit = (placeName) => {
    if (!placeName) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('tb_title', tb_title);
    formData.append('tb_content', tb_content);
    formData.append('place_name', placeName);

    for (let i = 0; i < tb_images.length; i++) {
      if (tb_images[i] !== null) {
        formData.append('tb_images', tb_images[i]);
      }
    }

    axios.post('/tb_write', formData, {
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
        <input type="text" value={tb_title} onChange={handleTitleChange} />
      </div>
      <div>
        <label>내용: </label>
        <textarea value={tb_content} onChange={handleContentChange} />
      </div>
      <div>
        <label>이미지 업로드: </label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        {tb_images.length > 0 && (
          <div>
            <p>선택된 이미지 미리보기:</p>
            {tb_images.map((image, index) => (
              <div key={index}>
                <img src={URL.createObjectURL(image)} alt="" />
                <button onClick={() => handleImageRemove(index)}>삭제</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedPlace && (
        <div>
          <p>선택한 지역: {selectedPlace}</p>
        </div>
      )}
      {message && (
        <div className="write-message">
          <p>{message}</p>
        </div>
      )}
      <div>
        <KakaoMapComponent apiKey={apiKey} onPlaceSelect={setSelectedPlace} />
      </div>
      <div>
        <button disabled={loading} onClick={() => handlePostSubmit(selectedPlace)}>
          {loading ? '글 작성 중...' : '글 작성'}
        </button>
      </div>
    </div>
  );
}

export default Trading_Board_Write_Component;
