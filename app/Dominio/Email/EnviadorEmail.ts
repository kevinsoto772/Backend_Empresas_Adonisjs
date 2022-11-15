export interface EnviadorEmail {
    enviarEmail(asunto:string, texto:string, destinatarios:string[], etiquetas?:string[]):void
    enviarEmailConTemplate(asunto:string, texto:string, destinatarios:string[], etiquetas?:string[]):void
}