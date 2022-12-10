const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Codificamos las operaciones que se podran realizar con relacion a los usuarios
const register = async (req, res, next) => {
  try {
    const newUser = new User();
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    const userDb = await newUser.save();

    return res.json({
      status: 201,
      message: 'Usuario registrado con éxito',
      data: userDb
    });
  } catch (err) {
    return next(err);
  }
}

const login = async (req, res, next) => {
  try {
    const userInfo = await User.findOne({ email: req.body.email })
    //Comparamos la contraseña
    if (bcrypt.compareSync(req.body.password, userInfo.password)) {
      //eliminamos la contraseña del usuario
      userInfo.password = null
      //creamos el token con el id y el name del user
      const token = jwt.sign(
        {
          id: userInfo._id,
          email: userInfo.email
        },
        req.app.get("secretKey"),
        { expiresIn: "1h" }
      );
      //devolvemos el usuario y el token.
      return res.json({
        status: 200,
        message: 'Login con éxito',
        data: { user: userInfo, token: token },
      });
    } else {
      return res.json({ status: 400, message: 'Bad request', data: null });
    }
  } catch (err) {
    return next(err);
  }
}

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization; //si en el header existe authorization lo guardamos en una variable. 
  //Esta tiene el formato: bearer token

  if(!authorization) { //Se comprueba que exista autorización
      return res.status(401).json({
          status: 401,
          message: "Unauthorized",
          data: null
      });
  }

  const splits = authorization.split(" ");//troceamos el token en dos partes
  //en la primera quitamos la palabra Bearer
  if(splits.length!=2 || splits[0]!="Bearer"){ //
      return res.status(400).json({
          status: 400,
          message: "Bad Request",
          data: null
      })
  }

  const jwtString = splits[1] // En esta variable guardamos la parte que contiene la información del token

  try {
      var token = jwt.verify(jwtString, req.app.get("secretKey")); //verificamos que el token tiene una firma correcta

  } catch(err) {
      return next(err)
  }

  const authority = { // Creamos un objeto authority que contienen la informacion del token, 
  //en este caso el id y el name del usuario
      id   : token.id,
      email : token.email
  }
  //Asignamos al request el objeto authority
  req.authority = authority;
  next();
}

//funcion logout, iguala el token a null.
const logout = (req, res, next) => {
  try {
    return res.json({
      status: 200,
      message: 'Logout OK',
      token: null
    });
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  register,
  login,
  isAuth,
  logout
}

