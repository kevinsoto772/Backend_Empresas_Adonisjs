import { Fichero } from "../Ficheros/Fichero"
import { ConfiguracionEmail } from "./ConfiguracionEmail"
import { Email } from "./Email"

export interface EnviadorEmail {
  enviarEmail(asunto:string, texto:string, destinatarios:string[], etiquetas?:string[]):void
  enviarTemplate<T>(configuracion:ConfiguracionEmail, email:Email<T>, adjunto?:Fichero):void
}
