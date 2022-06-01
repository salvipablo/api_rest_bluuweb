import jwt from "jsonwebtoken";

import { User } from "../models/Users.js";


import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Esta podria no usarse porque el save chocaria en la base de datos
    // porque ya existiria el mail y va al catch.
    // Es una alternativa buscando por email
    let user = await User.findOne({ email });

    if ( user ) throw { code: 11000 }

    user = new User({ email: email, password: password });
    
    // La sentencia de arriba se puede escribir asi
    // user = new User({ email, password });
    // Esto es porque el campo email y password 
    // coinciden con el nombre de la variable

    await user.save();

    // jwt token

    return res.status(201).json({ ok: true, description: "Usuario registrado." });

  } catch (error) {
    console.log(error);

    // Es una alternativa por defecto, falla el save y llega aca
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Ya existe este usuario' });
    }

    return res.status(500).json({ error: 'Error de servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) return res.status(403).json({ error: "No existe este usuario" })

    const correctPassword = await user.comparePassword(password);
    if (!correctPassword) 
                return res.status(403).json({ error: "Contraseña incorrecta" })

    // Generate el token JWT. 
    //const { token, expiresIn } = generateToken(user._id);
    
    // Generate el token JWT. 
    generateRefreshToken(user._id, res);

    return res.json({ ok: "Login satisfactorio" });
  } catch (error) {
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const infoUser = async (req, res) => {
  try {
    // lean es para que la busqueda, no venga con toda la informacion y metodos
    // Esto devuelve un objeto simple de javascript con la informacion
    // Da mas velocidad a la consulta y la devolucion, menos cosumo de recursos
    const user = await User.findById(req.uid).lean();
    
    res.json({ email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Error en servidor' });
  }
};

export const refreshToken = (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    if ( !refreshTokenCookie ) throw new Error("No refreshTokenCookie");

    const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

    const { token, expiresIn } = generateToken(uid);

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);

    const tokenVerificationErrors = {
      "invalid signature": "La firma del jwt no es valida",
      "jwt expired": "JWT Expirado",
      "invalid token": "Token no valido",
      "No Bearer": "No existe el token en el header - Utiliza Bearer",
      "jwt malformed": "JWT - Formato no valido",
      "No refreshTokenCookie": "No tiene el token de refresh"
    }

    return res
              .status(401)
              .json({ error: tokenVerificationErrors[error.message] });
  }
};

export const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ ok: "Logout" });
}