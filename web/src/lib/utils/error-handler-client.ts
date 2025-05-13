"use client";

import axios, { AxiosError } from 'axios';

export function handleClientApiError(error: unknown, defaultMessage: string = 'Ocurrió un error inesperado.'): Error {
    let message = defaultMessage;
    let status: number | undefined;
    let details: any = undefined;

    if (axios.isAxiosError(error)) {
        status = error.response?.status;
        details = error.response?.data; // Cuerpo del error del API/Route Handler
        const apiMessage = details?.message || error.message; // Mensaje del API o mensaje de Axios

        // Mapear status comunes a mensajes si los detalles del API no son suficientes
         if (status === 400) message = apiMessage || 'Petición inválida.';
         else if (status === 401) message = apiMessage || 'Credenciales incorrectas o no autorizado.';
         else if (status === 403) message = apiMessage || 'Permiso denegado.';
         else if (status === 404) message = apiMessage || 'Recurso no encontrado.';
         else if (status === 500) message = apiMessage || `Error del servidor: status ${status}.`;
         else if (typeof apiMessage === 'string' && apiMessage.length > 0) message = apiMessage; // Usar mensaje del API si es valido
    } else if (error instanceof Error) {
        // Es un Error JS estándar
        message = error.message;
    } else {
        // Cualquier otro valor lanzado
         message = 'Ocurrió un error completamente inesperado.';
    }

    // Retorna una nueva instancia de Error con la información formateada
    // Puedes adjuntar status o details si tu lógica de cliente lo usa
    const clientError = new Error(message);
    (clientError as any).status = status;
    (clientError as any).details = details;

    return clientError;
}