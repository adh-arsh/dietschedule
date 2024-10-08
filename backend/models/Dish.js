const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
    user: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    day: { type: String, required: true },
});

module.exports = mongoose.model('Dish', DishSchema);
