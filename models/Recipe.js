// Archivo Recipe.js dentro de la carpeta models
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creamos el esquema de recetas
const recipeSchema = new Schema(
  {
    name: { type: String, required: true },//La propiedad required hace que el campo sea obligatorio
    image: { type: String },
    ingredients: [
                {   
                    ingredient: {type: mongoose.Types.ObjectId, ref: 'Ingredient'},
                    quantity: Number
                }
            ]
  },
  {
    // Esta propiedad servirá para guardar las fechas de creación y actualización de los documentos
    timestamps: true,
  }
);

// Creamos y exportamos el modelo Recipe
const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;