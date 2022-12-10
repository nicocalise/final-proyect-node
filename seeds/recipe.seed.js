const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
require('dotenv').config();

//1) agregar la cantidad de recetas necesarias para inyectar a la base de datos
//2) completar el resto de la semilla
const recipes = [
  {
    name: 'Pasta con salsa de tomate',
    image: '',
    ingredients: [
        {
         
        }
    ]
  },
  {
    name: 'Ensalada de atun',
    image: '',
    ingredients: [
        {

        }
    ]
  },
  {
    name: 'Carne a la cacerola',
    image: '',
    ingredients: [
        {
        
        }
    ]
  }
];

const recipeDocuments = recipes.map(item => new Recipe(item));

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/foody';

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
  .then(async () => {
    const allRecipes = await Recipe.find();
    if (allRecipes.length) {
        await Recipe.collection.drop();
    }
    })
  .catch((err) => console.log(`Error deleting data: ${err}`))
  .then(async () => {
	    await Recipe.insertMany(recipeDocuments);
    })
  .catch((err) => console.log(`Error creating data: ${err}`))
  .finally(() => mongoose.disconnect());