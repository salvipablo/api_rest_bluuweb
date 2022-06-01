import jwt from 'jsonwebtoken';
import { tokenVerificationErrors } from '../utils/tokenManager.js';

export const requireToken = (req, res, next) => {
  try {
    let token = req.headers?.authorization;

    if ( !token ) throw new Error('No Bearer');

    // Separo la palabra Bearer y el token por el esacio en blanco y
    // me quedo en la variable con el token
    token = token.split(" ")[1];

    // Verifico si es un toquen valido. Sino lo es sale por el catch, asi
    // se maneja JWT
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    // Pongo en el req una propiedad uid con el id sacado del Token.
    req.uid = uid;
    
    next();
  } catch (error) {
    console.log(error.message);

    return res
              .status(401)
              .json({ error: tokenVerificationErrors[error.message] });
  }
};
