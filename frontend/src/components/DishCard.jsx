import React, { useState } from 'react';
import './DishCard.css';
import { DeleteDishDB } from '../controller/dishes';

const DishCard = ({ id, name, image, onDelete, onDragStart }) => {
    return (
        <div className="dish-card" draggable onDragStart={(e) => onDragStart(e, id)}>
            <button className="delete-button" onClick={() => onDelete(id)}>✖</button>
            <img src={image} alt={name} className="dish-image" />
            <div className="dish-name">{name}</div>
        </div>
    );
};

export default DishCard;
