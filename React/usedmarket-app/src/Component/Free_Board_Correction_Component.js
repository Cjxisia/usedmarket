import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FreeBoardCorrectionComponent({ fb_id, onCancel, onPostUpdate }) {
  const [fb_title, setTitle] = useState('');
  const [fb_content, setContent] = useState('');
  const [old_fb_images, setold_fb_images] = useState([]);
  const [fb_images, setfb_images] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/fb/${fb_id}`);
        setTitle(response.data.fb_title);
        setContent(response.data.fb_content);
  
        const imageResponse = await axios.get(`/fb/img/${fb_id}`);
  
        setold_fb_images(imageResponse.data.map((path) => ({ path, file: path })));
      } catch (error) {
        console.error('Error fetching post details for correction:', error);
      }
    };
  
    fetchPost();
  }, [fb_id]);

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

    setfb_images((prevImages) => [
      ...prevImages,
      ...Array.from(selectedImages).map((file) => ({
        path: URL.createObjectURL(file),
        file,
      })),
    ]);
  };

  const handleImageRemove = (index, isNewImage) => {
    if (isNewImage) {
      setfb_images((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages.splice(index, 1);
        return updatedImages;
      });
    } else {
      setold_fb_images((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages.splice(index, 1);
        return updatedImages;
      });
    }
  };

  const handlePostUpdate = () => {
    console.log('Old Image Names:', extractImageNames(old_fb_images));
    console.log('New Image Names:', extractImageNames(fb_images));
    setLoading(true);

    const formData = new FormData();
    formData.append('fb_title', fb_title);
    formData.append('fb_content', fb_content);

    extractImageNames(old_fb_images).forEach((imageName) => {
      formData.append('old_fb_images', imageName);
    });

    fb_images.forEach((image) => {
      formData.append('fb_images', image.file);
    });

    axios
      .put(`/fb/${fb_id}/update`, formData, {
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
        <input type="text" value={fb_title} onChange={handleTitleChange} />
      </div>
      <div>
        <label>내용: </label>
        <textarea value={fb_content} onChange={handleContentChange} />
      </div>
      <div>
        <label>이미지 수정: </label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        {old_fb_images.length > 0 && (
          <div>
            <p>기존 이미지:</p>
            {old_fb_images.map((image, index) => (
              <div key={index}>
                <img src={image.path} alt={`Original Image ${index + 1}`} />
                <button onClick={() => handleImageRemove(index, false)}>삭제</button>
              </div>
            ))}
          </div>
        )}
        {fb_images.length > 0 && (
          <div>
            <p>새로운 이미지:</p>
            {fb_images.map((image, index) => (
              <div key={index}>
                <img src={image.path} alt={`New Image ${index + 1}`} />
                <button onClick={() => handleImageRemove(index, true)}>삭제</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <button disabled={loading} onClick={handlePostUpdate}>
          {loading ? '수정 중...' : '수정 완료'}
        </button>
        <button onClick={onCancel}>취소</button>
      </div>
    </div>
  );
}

export default FreeBoardCorrectionComponent;
