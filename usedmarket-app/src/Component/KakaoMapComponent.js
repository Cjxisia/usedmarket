import React, { useEffect, useRef, useState } from 'react';

const KakaoMapComponent = ({ apiKey, onPlaceSelect }) => {
  const [map, setMap] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('kakao-map');
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청을 기본 위치로 설정
          level: 3,
        };
        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);

        // 지도 클릭 이벤트 리스너 추가
        window.kakao.maps.event.addListener(mapInstance, 'click', function(mouseEvent) {
          const latlng = mouseEvent.latLng;
          const geocoder = new window.kakao.maps.services.Geocoder();

          geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
            if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
              const place = result[0];
              onPlaceSelect(place.address.address_name);
            }
          });
        });
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 검색 함수
  const handleSearch = () => {
    if (!map || !searchInputRef.current) return;

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(searchInputRef.current.value, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
        const place = data[0];
        const latlng = new window.kakao.maps.LatLng(place.y, place.x);
        map.panTo(latlng); // 검색한 위치로 지도 이동
        onPlaceSelect(place.place_name);
      }
    });
  };

  return (
    <div>
      <input type="text" ref={searchInputRef} />
      <button onClick={handleSearch}>검색</button>
      <div id="kakao-map" style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default KakaoMapComponent;
