import React, { useState } from 'react';
import './DishFormPopup.css';
const DishFormPopup = ({ onClose, onSubmit }) => {

    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [day, setDay] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Set image as base64
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId'); // Get user ID from local storage
        onSubmit({ name, image, day, userId }); // Pass data back to WeekPlanner
        onClose(); // Close the popup
    };



    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="dish-form-popup__overlay">
            <div className="dish-form-popup__container">
                <h2 className="dish-form-popup__header">Add a New Dish</h2>
                <form className="dish-form-popup__form" onSubmit={handleSubmit}>
                    <label className="dish-form-popup__label">
                        Name:
                        <input
                            className="dish-form-popup__input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label className="dish-form-popup__label">
                        Image:
                        <input
                            className="dish-form-popup__file"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            required
                        />
                    </label>
                    <label className="dish-form-popup__label">
                        Day:
                        <select className="dish-form-popup__select" value={day} onChange={(e) => setDay(e.target.value)} required>
                            <option value="" disabled>Select a day</option>
                            {daysOfWeek.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </label>
                    <button className="dish-form-popup__button" type="submit">Add Dish</button>
                    <button type="button" className="dish-form-popup__cancel-button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>

    );
};

export default DishFormPopup;
