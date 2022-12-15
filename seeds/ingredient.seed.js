const mongoose = require('mongoose');
const Ingredient = require('../models/Ingredient');
require('dotenv').config();

const ingredients = [
  {
    name: 'Cebolla'
  },
  {
    name: 'Sal'
  },
  {
    name: 'Pimiento'
  },
  {
    name: 'Pasta'
  },
  {
    name: 'Arroz'
  },
  {
    name: 'Agua'
  },
  {
    name: 'Tomate'
  },
  {
    name: 'Huevos'
  },
  {
    name: 'Arroz'
  },
  {
    name: 'Carne Vacuna'
  },
  {
    name: 'Carne de Cerdo'
  },
  {
    name: 'Atun'
  },
  {
    name: 'Aceite'
  }
];

const ingredientDocuments = ingredients.map(item => new Ingredient(item));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foody';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
  .then(async () => {
    const allIngredients = await Ingredient.find();
    if (allIngredients.length) {
        await Ingredient.collection.drop();
    }
    })
  .catch((err) => console.log(`Error deleting data: ${err}`))
  .then(async () => {
	    await Ingredient.insertMany(ingredientDocuments);
    })
  .catch((err) => console.log(`Error creating data: ${err}`))
  .finally(() => mongoose.disconnect());