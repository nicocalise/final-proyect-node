const express = require('express');
require('dotenv').config();

// Auth
require("jsonwebtoken");

//utils
const connect = require('./utils/db.js')

//Server
connect();
const PORT = process.env.PORT || 3000;
const server = express();

//Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.set("secretKey", process.env.SESSION_SECRET || "nodeRestApi");
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


//Aqui van las rutas
const ingredientRoute = require('./routes/ingredient.routes');
const recipeRoute = require('./routes/recipe.routes');
const userRoutes = require('./routes/user.routes');
server.use('/recipes', recipeRoute);
server.use('/ingredients', ingredientRoute);
server.use('/users', userRoutes);

//error control
server.use('*', (req, res, next) => {
	const error = new Error('Route not found'); 
	error.status = 404;
	next(error); 
  });

  server.use((error, req, res, next) => {
    return res.status(error.status || 500).json(error.message || 'Unexpected error');
  });

server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});