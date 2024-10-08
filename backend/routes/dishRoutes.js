const express = require('express');
const { check, validationResult } = require('express-validator');
const Dish = require('../models/Dish');

const router = express.Router();


// POST /api/dishes (Create a Dish)
router.post('/', [
    check('userId', 'User ID is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('image', 'Image URL is required').not().isEmpty(),
    check('day', 'Day is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, name, image, day } = req.body;

    try {
        // Check for existing dish with the same name
        const existingDish = await Dish.findOne({ name });
        if (existingDish) {
            return res.status(400).json({ message: 'Dish with this name already exists' });
        }

        const newDish = new Dish({
            user: userId,
            name,
            image,
            day,
        });

        const savedDish = await newDish.save();
        res.json(savedDish);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// GET /api/dishes (Get Dishes for the authenticated user)
router.get('/', async (req, res) => {
    try {
        const dishes = await Dish.find({ user: req.user.id }); // Fetch dishes for the authenticated user
        res.json(dishes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        console.log("Fetching dishes for userId:", userId);

        // Fetch dishes that belong to the user
        const dishes = await Dish.find({ user: userId });

        //return the dishes array (could be empty)
        res.json(dishes);
    } catch (error) {
        console.error('Error fetching dishes:', error); // Log the error details
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


// PUT /api/dishes/:id (Update a Dish)
router.put('/:id', async (req, res) => {
    const { name, image, day } = req.body;

    try {
        // Check if the dish exists
        let dish = await Dish.findById(req.params.id);
        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' });
        }

        // Check if the authenticated user is the owner of the dish
        if (dish.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update the dish
        dish.name = name || dish.name;
        dish.image = image || dish.image;
        dish.day = day || dish.day;

        await dish.save();
        res.json(dish);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/dishes/:id (Delete a Dish)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDish = await Dish.findByIdAndDelete(id);

        if (!deletedDish) {
            return res.status(404).json({ message: 'Dish not found' });
        }

        res.json({ message: 'Dish deleted successfully', deletedDish });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
