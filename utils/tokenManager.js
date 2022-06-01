//import res from "express/lib/response";
import jwt from "jsonwebtoken";

export const generateToken = (uid) => {
  const expiresIn = 60 * 15;

  try {
    const token = jwt.sign({uid}, process.env.JWT_SECRET, {expiresIn});
    return { token, expiresIn };
  } catch (error) {
    console.log(error);
  }
};

export const generateRefreshToken = (uid, res ) => {
  const expiresIn = 60 * 60 * 24 * 30;

  try {
    const refreshToken = jwt.sign({uid}, process.env.JWT_REFRESH, {expiresIn});

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !(process.env.MODO === "Developer"),
      expires: new Date(Date.now() + expiresIn * 1000)
    });
  } catch (error) {
    console.log(error);
  }
};

export const tokenVerificationErrors = {
  "invalid signature": "La firma del jwt no es valida",
  "jwt expired": "JWT Expirado",
  "invalid token": "Token no valido",
  "No Bearer": "No existe el token en el header - Utiliza Bearer",
  "jwt malformed": "JWT - Formato no valido",
  "No refreshTokenCookie": "No tiene el token de refresh"
}
