import React, { useState, useEffect } from 'react';

const Geolocation = () => {
  const [locationData, setLocationData] = useState({
    lat: null,
    lon: null,
    error: null
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            error: null
          });
        },
        (error) => {
          setLocationData({
            lat: null,
            lon: null,
            error: `Erro: ${error.message}`
          });
        }
      );
    } else {
      setLocationData({
        lat: null,
        lon: null,
        error: 'Geolocalização não é suportada pelo seu navegador.'
      });
    }
  }, []);

  return (
    <div>
      <h1>Informações de Geolocalização</h1>
      {locationData.error ? (
        <p>{locationData.error}</p>
      ) : (
        <div>
          <p>Latitude: {locationData.lat}</p>
          <p>Longitude: {locationData.lon}</p>
        </div>
      )}
    </div>
  );
};

export default Geolocation;
