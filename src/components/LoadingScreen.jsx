import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ message = "ЗАГРУЗКА..." }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <div className="loading-text">{message}</div>
        <div className="loading-subtext">ПОДКЛЮЧЕНИЕ К СЕРВЕРУ</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
