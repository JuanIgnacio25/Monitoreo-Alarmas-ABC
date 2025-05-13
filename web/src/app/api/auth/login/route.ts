"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import setCookieParser from "set-cookie-parser";

interface LoginPayload {
  email: string;
  password: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  const cookieStore = await cookies();
  const payload: LoginPayload = await req.json();

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      payload,
      {
        withCredentials: true,
      }
    );

    const setCookieHeader = res.headers["set-cookie"];


    let newRefreshTokenValue = null;

    if (setCookieHeader) {
      // setCookieParser.parse maneja strings y arrays de strings automáticamente
      const parsedCookies = setCookieParser.parse(setCookieHeader, {
        decodeValues: true,
        map: false, // Queremos un array de objetos {name, value, attributes...}
      });

      if (parsedCookies.length > 0) {
        const refreshTokenCookieParsed = parsedCookies.find(
          (cookie: { name: string }) => cookie.name === "refreshToken"
        );

        if (refreshTokenCookieParsed) {
          // Obtén el valor del token parseado
          newRefreshTokenValue = refreshTokenCookieParsed.value;

          // Usa cookies().set() para setear la cookie
          (await cookies()).set({
            name: refreshTokenCookieParsed.name,
            value: refreshTokenCookieParsed.value,
            expires: refreshTokenCookieParsed.expires,
            maxAge: refreshTokenCookieParsed.maxAge,
            httpOnly: true,
            secure:
              process.env.NODE_ENV === "production" ||
              refreshTokenCookieParsed.secure === true,
            sameSite: "strict",
            path: "/",
          });
        } else {
          // Si el Set-Cookie estaba ahi pero no contenia la cookie esperada, asumir fallo y eliminar
          cookieStore.delete("refreshToken");
          return NextResponse.json(
            {
              message: "Refresh failed - token cookie missing in API response",
            },
            { status: 500 }
          );
        }
      } else {
        // Si el encabezado estaba vacio o no contenia strings parseables, asumir fallo.
        cookieStore.delete("refreshToken");
        return NextResponse.json(
          { message: "Refresh failed - invalid token cookie received" },
          { status: 500 }
        );
      }
    } else {
      // Si no hay Set-Cookie, ¿significa fallo? Decide tu lógica. Eliminar la cookie es seguro.
      cookieStore.delete("refreshToken");
      return NextResponse.json(
        { message: "Refresh failed - no token cookie received" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({access_token:res.data.access_token});
  } catch (error: any) {
    console.log(error.response.data);

    return NextResponse.json(
      { message: "Usuario o Contraseña incorrectos" },
      { status: 401 }
    );
  }
}
