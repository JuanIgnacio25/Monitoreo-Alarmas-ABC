import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

import axios from "axios";
import { handleApiRouteError } from "@/lib/utils/error-handler-server";

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("refreshToken");
  const authorizationHeader = (await headers()).get('authorization');
  const accessToken = authorizationHeader?.split(' ')[1];

  if (!token?.value) {
    // En caso de que la cookie de refresh no venga, limpia por si acaso y devuelve error
    cookieStore.delete("refreshToken");
    return NextResponse.json(
      { message: "Usted no se encuentra logeado" },
      { status: 401 }
    );
  }

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: `refreshToken=${token.value}`,
        },
        withCredentials: true,
      }
    );

    cookieStore.delete("refreshToken");

    return NextResponse.json({ message: "Cerraste sesion correctamente" });
  } catch (error: unknown) {
    
    return handleApiRouteError(error, "Error al cerrar Sesion");
  }
}
