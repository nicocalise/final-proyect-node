const express = require('express');
const fileMiddlewares = require('../middlewares/file.middleware');

const Recipe = require('../models/Recipe');

const router = express.Router();

//Find all
router.get('/', async (req, res, next) =>{
    try{
        const recipes = await Recipe.find().populate('ingredients.ingredient');
        return res.status(200).json(recipes);
    }catch(err){
        return next(err);
    }
});

//find by id
router.get('/:id', async(req, res, next)=>{
    const { id } = req.params;
    try{
        const recipe = await Recipe.findById(id).populate('ingredients.ingredient');
        return res.status(200).json(recipe);
    }catch(err){
        return next(err);
    }
});

//post
router.post('/', [fileMiddlewares.upload.single('image'), fileMiddlewares.uploadToCloudinary], async(req, res, next)=>{
    try{
        const recipePicture = req.file_url ? req.file_url : null;
        const recipe = new Recipe({
            name: req.body.name,
            image: recipePicture,
            ingredients : []
        });
        const createdRecipe = await recipe.save();
        res.status(201).json(createdRecipe);
    }catch(err){
        return next(err);
    }
});

//add ingredient to a recipe
router.put('/:recipeId/add-ingredient', async (req, res, next) => {
    try {
        const { recipeId } = req.params;
        const { ingredientId } = req.body;
        const { quantity} = req.body;
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            recipeId,
            { $push:{ 
                        ingredients:{ 
                                        ingredient:ingredientId,
                                        quantity:quantity
                                    }   
                    }
            },
            { new: true }
        );
        return res.status(200).json(updatedRecipe);
    } catch (error) {
        return next(error);
    }
});

//delete
router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        await Recipe.findByIdAndDelete(id);
        return res.status(200).json('Recipe deleted!');
    } catch (error) {
        return next(error);
    }
});



module.exports = router;