import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: number,
  email: string,
  role: string,
  exp: number;
}

export const isTokenExpiredOrAboutToExpire = (accessToken: string | null, expirationThresholdSeconds: number = 60): boolean => {
  if (!accessToken) {
    return true;
  }
  try {
    const decodedToken = jwtDecode<DecodedToken>(accessToken);
  
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Comprueba si el token ha expirado o expirará en los próximos 'expirationThresholdSeconds' segundos
    return decodedToken.exp < currentTime + expirationThresholdSeconds;
  } catch (error) {
    console.log({errorAuthUtils:error});
    
    // El token no es válido o no se puede decodificar
    return true;
  }
};