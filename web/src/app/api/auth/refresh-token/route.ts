// app/api/auth/refresh-token/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import setCookieParser from "set-cookie-parser";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("refreshToken");
  
  if (!token?.value) {
    // En caso de que la cookie de refresh no venga, limpia por si acaso y devuelve error
    cookieStore.delete("refreshToken");
    return NextResponse.json(
      { message: "No refresh token provided" },
      { status: 401 }
    );
  }

  try {
    const res = await axios.post<{ access_token: string }>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {},
      {
        headers: {
          Cookie: `refreshToken=${token.value}`,
        },
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
            { status: 404 }
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
      // Si no hay Set-Cookie devuelve bad request
      cookieStore.delete("refreshToken");
      return NextResponse.json(
        { message: "Refresh failed - no token cookie received" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { access_token: res.data.access_token },
      { status: 200 }
    );
  } catch (error: any) {
    // Usa cookies().delete()
    (await cookies()).delete("refreshToken");

    const status = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.message || error.message || "Internal Server Error";
    return NextResponse.json({ message: errorMessage }, { status });
  }
}
