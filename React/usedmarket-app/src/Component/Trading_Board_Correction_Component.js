import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KakaoMapComponent from './KakaoMapComponent';

function TradingBoardCorrectionComponent({ tb_id, onCancel, onPostUpdate }) {
  const [tb_title, setTitle] = useState('');
  const [tb_content, setContent] = useState('');
  const [old_tb_images, setold_tb_images] = useState([]);
  const [tb_images, settb_images] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [message, setMessage] = useState('');
  const apiKey = '9205f8c2a175502c16ee84d9ad8b0a8d';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/tb/${tb_id}`);
        setTitle(response.data.tb_title);
        setContent(response.data.tb_content);
  
        const imageResponse = await axios.get(`/tb/img/${tb_id}`);
  
        setold_tb_images(imageResponse.data.map((path) => ({ path, file: path })));
      } catch (error) {
        console.error('Error fetching post details for correction:', error);
      }
    };
  
    fetchPost();
  }, [tb_id]);

  const extractImageNames = (images) =>
  images.map((image) => (image ? extractFileNameFromPath(image.path) : null)).filter(Boolean);

  const extractFileNameFromPath = (imagePath) => {
  const pathSegments = imagePath.split('/');
  return pathSegments[pathSegments.length - 1];
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImages = e.target.files;

    settb_images((prevImages) => [
      ...prevImages,
      ...Array.from(selectedImages).map((file) => ({
        path: URL.createObjectURL(file),
        file,
      })),
    ]);
  };

  const handleImageRemove = (index, isNewImage) => {
    if (isNewImage) {
      settb_images((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages.splice(index, 1);
        return updatedImages;
      });
    } else {
      setold_tb_images((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages.splice(index, 1);
        return updatedImages;
      });
    }
  };

  const handlePostUpdate = (placename) => {
    if (!placename) return;
    
    console.log('Old Image Names:', extractImageNames(old_tb_images));
    console.log('New Image Names:', extractImageNames(tb_images));
    setLoading(true);

    const formData = new FormData();
    formData.append('tb_title', tb_title);
    formData.append('tb_content', tb_content);
    formData.append('placename', placename);

    extractImageNames(old_tb_images).forEach((imageName) => {
      formData.append('old_tb_images', imageName);
    });

    tb_images.forEach((image) => {
      formData.append('tb_images', image.file);
    });

    axios
      .put(`/tb/${tb_id}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log('Post updated successfully:', response);
        onPostUpdate();
      })
      .catch((error) => {
        console.error('Error updating post:', error);
        if (error.response) {
          console.error('Server responded with:', error.response.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>글 수정</h2>
      <div>
        <label>제목: </label>
        <input type="text" value={tb_title} onChange={handleTitleChange} />
      </div>
      <div>
        <label>내용: </label>
        <textarea value={tb_content} onChange={handleContentChange} />
      </div>
      <div>
        <label>이미지 수정: </label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        {old_tb_images.length > 0 && (
          <div>
            <p>기존 이미지:</p>
            {old_tb_images.map((image, index) => (
              <div key={index}>
                <img src={image.path} alt={`Original Image ${index + 1}`} />
                <button onClick={() => handleImageRemove(index, false)}>삭제</button>
              </div>
            ))}
          </div>
        )}
        {tb_images.length > 0 && (
          <div>
            <p>새로운 이미지:</p>
            {tb_images.map((image, index) => (
              <div key={index}>
                <img src={image.path} alt={`New Image ${index + 1}`} />
                <button onClick={() => handleImageRemove(index, true)}>삭제</button>
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
        <button disabled={loading} onClick={() => handlePostUpdate(selectedPlace)}>
          {loading ? '수정 중...' : '수정 완료'}
        </button>
        <button onClick={onCancel}>취소</button>
      </div>
    </div>
  );
}

export default TradingBoardCorrectionComponent;