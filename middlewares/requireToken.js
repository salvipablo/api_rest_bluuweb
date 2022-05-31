  import jwt from 'jsonwebtoken';

  export const requireToken = (req, res, next) => {
    try {
      let token = req.headers?.authorization;

      if ( !token ) throw new Error('No Bearer');

      token = token.split(" ")[1];
      const { uid } = jwt.verify(token, process.env.JWT_SECRET);

      req.uid = uid;
      
      next();
    } catch (error) {
      console.log(error.message);

      const tokenVerificationErrors = {
        "invalid signature": "La firma del jwt no es valida",
        "jwt expired": "JWT Expirado",
        "invalid token": "Token no valido",
        "No Bearer": "No existe el token en el header - Utiliza Bearer",
      }

      return res
                .status(401)
                .json({ error: tokenVerificationErrors[error.message] });
    }
  };