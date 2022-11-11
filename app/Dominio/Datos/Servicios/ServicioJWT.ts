import Env from '@ioc:Adonis/Core/Env'
import JwtExpiradoException from 'App/Exceptions/JwtExpiradoException'
import JwtInvalidoException from 'App/Exceptions/JwtInvalidoException'
import jwt from 'jsonwebtoken'

export class ServicioAutenticacionJWT {

    public static readonly tokenExpiraEn = '24h'
    public static readonly erroresJwt = {
        EXPIRADO: "TokenExpiredError",
        INVALIDO: "JsonWebTokenError"
    }

    public static generarToken(usuario: string, contrasena: string):string {
        const opciones = {
            expiresIn: this.tokenExpiraEn
        }
        return jwt.sign({}, Env.get('JWT_SECRET_KEY'), opciones)
    }

    public static verificarToken(authorizationHeader: string):boolean {
        let token = authorizationHeader.split(' ')[1]
        token = jwt.verify(token, Env.get('JWT_SECRET_KEY'), (error) => {
            if (error) {
                this.manejoExcepciones(error)
            }
        })
        return true
    }

    private static manejoExcepciones(error):void {
        if (error.name == this.erroresJwt.EXPIRADO) {
            throw new JwtExpiradoException(error.message)
        }
        if (error.name == this.erroresJwt.INVALIDO) {
            throw new JwtInvalidoException(error.message)
        }
    }
}