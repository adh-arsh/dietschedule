import React from 'react';
import './ErrorPopup.css';

const ErrorPopup = ({ message, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <h2>Error</h2>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ErrorPopup;
