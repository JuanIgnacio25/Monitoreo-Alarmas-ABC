import { NextResponse } from 'next/server';
import axios from 'axios';
import { AxiosError } from 'axios';

export function handleApiRouteError(
    error: unknown,
    defaultMessage: string = 'Ocurrió un error en el servidor.',
    defaultStatus: number = 500
): NextResponse {
    let status = defaultStatus;
    let message = defaultMessage;
    let apiDetails: any = undefined;

    if (axios.isAxiosError(error)) {
        status = error.response?.status || defaultStatus;
        apiDetails = error.response?.data;
        const apiMessage = apiDetails?.message || error.message;

        // Usa el mensaje del API si es un string, de lo contrario usa el genérico o mapea
        if (typeof apiMessage === 'string' && apiMessage.length > 0) {
             message = apiMessage;
        } else {
            // Mapear status conocidos a mensajes si el API no da un buen mensaje
             if (status === 400) message = 'Petición inválida al API.';
             else if (status === 401) message = 'Autenticación fallida con el API.';
             else if (status === 403) message = 'Permiso denegado por el API.';
             else if (status === 404) message = 'Recurso no encontrado en el API.';
             else if (status >= 500) message = 'Error interno del API externo.';
             else message = `Error del API externo: status ${status}`;
        }

    } else if (error instanceof Error) {
         message = error.message;
         status = 500; // Generalmente un error interno del servidor
    } else {
         message = 'Ocurrió un error inesperado.';
         status = 500;
    }

    console.log({apiDetails});
    

    return NextResponse.json({ message, details: apiDetails }, { status });
}