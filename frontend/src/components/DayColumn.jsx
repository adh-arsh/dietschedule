import React, { useState } from 'react';

const DayColumn = ({ day, dishes, onAddDish }) => {
    const [showForm, setShowForm] = useState(false);

    const handleAddDish = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onAddDish(day, formData);
        setShowForm(false);
    };

    return (
        <div className="day-column">
            <h2>{day}</h2>
            <button onClick={() => setShowForm(!showForm)}>Add Dish</button>
            {showForm && (
                <form onSubmit={handleAddDish}>
                    <input type="text" name="dishName" placeholder="Dish Name" required />
                    <input type="file" name="image" accept="image/*" required />
                    <button type="submit">Submit</button>
                </form>
            )}
            <div className="dish-list">
                {dishes.map(dish => (
                    <div key={dish._id} className="dish-item">
                        <img src={dish.imageUrl} alt={dish.name} />
                        <p>{dish.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DayColumn;
