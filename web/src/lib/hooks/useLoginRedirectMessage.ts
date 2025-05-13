"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

type LoginMessageParam = 'auth_required' | 'auth_failed' | 'logged_out' | string;


function useLoginRedirectMessage(): string | null {
  const searchParams = useSearchParams();
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    const messageParam = searchParams.get('error_message') as LoginMessageParam | null;

    if (messageParam) {
      let messageText: string;
      switch (messageParam) {
        case 'auth_required':
          messageText = 'Debes iniciar sesión para acceder a esta página.';
          break;
        case 'auth_failed':
          messageText = 'La sesión expiró o el token no es válido. Por favor, inicia sesión de nuevo.';
          break;
        case 'logged_out':
          messageText = 'Has cerrado sesión correctamente.';
          break;
        default:
          messageText = 'Por favor, inicia sesión para continuar.'; // Mensaje por defecto más genérico
          break;
      }
      setInfoMessage(messageText);

       // Opcional: Limpiar el parámetro de la URL después de mostrar (puede ser molesto para el usuario)
       // const url = new URL(window.location.href);
       // url.searchParams.delete('message');
       // history.replaceState(null, '', url.toString()); // Cuidado con esto, puede interferir con navegacion

    } else {
      setInfoMessage(null); // No hay parametro, no hay mensaje
    }
  }, [searchParams]);

  return infoMessage;
}

export default useLoginRedirectMessage;