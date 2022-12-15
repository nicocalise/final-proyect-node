const express = require('express');

const Ingredient = require('../models/Ingredient');
const Recipe = require('../models/Recipe');

const router = express.Router();

//Find all ingredients
router.get('/', async (req, res, next) => {
	try {
		const ingredients = await Ingredient.find();
		return res.status(200).json(ingredients)
	} catch (error) {
		return next(error)
	}
});

//Find by ID
router.get('/:id', async (req, res, next) => {
	const id = req.params.id;
	try {
		const ingredient = await Ingredient.findById(id);
		if (ingredient) {
			return res.status(200).json(ingredient);
		} else {
			return res.status(404).json('No character found by this id');
		}
	} catch (error) {
		return next(error);
	}
});

//Creation POST
router.post('/', async( req, res, next)=>{
    const { name } = req.body;
    const ingredient = { name };
    try {
        const newIngredient = new Ingredient(ingredient);
        const createdIngredient = await newIngredient.save();
        return res.status(201).json(createdIngredient);
      } catch (error) {
        next(error);
      }
});

//Delete
//TODO delete en cascada si hay algun ingrediente en la receta
router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        //const ingredient = await Recipe.find({ingredients: { [ingredient:id]}})
        await Ingredient.findByIdAndDelete(id);
        return res.status(200).json('Ingredient deleted!');
    } catch (error) {
        return next(error);
    }
});

//PUT
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const ingredientModify = new Ingredient(req.body) 
        ingredientModify._id = id 
        await Ingredient.findByIdAndUpdate(id , ingredientModify)
        return res.status(200).json(ingredientModify)
    } catch (error) {
        return next(error)
    }
});

module.exports = router;