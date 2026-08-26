import { rolUsuario } from './enums/rolUsuario';
import { estadoUsuario } from './enums/estadoUsuario';

export interface Usuario {
    idUsuario: number;
    nombreUsuario: string;
    password: string;
    email: string;
    rol: rolUsuario;
    estadoUsuario: estadoUsuario;
}