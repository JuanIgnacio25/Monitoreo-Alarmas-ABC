"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginFormSchema, LoginFormValues } from "./loginSchema";
import { loginUser } from "@/lib/api/api";

import useLoginRedirectMessage from "@/lib/hooks/useLoginRedirectMessage";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const infoMessage = useLoginRedirectMessage();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoginError(null); // Limpia errores de submit anteriores
    form.clearErrors(); // Limpia errores de validacion del formulario

    try {
      await loginUser(values);
      console.log("Te logeaste Rey");
      // import { useRouter } from 'next/navigation';
      // const router = useRouter();
      // router.push('/dashboard');
    } catch (error: any) {
      if (error.status === 401) {
        setLoginError("Usuario o Contraseña incorrectos");
      } else if (error.message) {
        setLoginError(`Error al iniciar sesión: ${error.message}`);
      } else {
        setLoginError("Ocurrió un error inesperado al iniciar sesión.");
      }
    }
  };

  return (
    <div className="container min-h-[100vh] flex flex-col justify-center items-center">
      <div className="flex gap-2 m-2">
        <Link href={"/"}>
          <Button>Home</Button>
        </Link>
        <Link href={"/auth/profile"}>
          <Button>Profile</Button>
        </Link>
      </div>
      {/* --- Mostrar el mensaje informativo de la URL si existe --- */}
      {infoMessage && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-800 rounded max-w-md text-center">
          {infoMessage}
        </div>
      )}
      {/* --- Fin del mensaje informativo --- */}
      <Card className="w-full max-w-md">
        {/* Ajusta ancho si es necesario */}
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Iniciar Sesion
          </CardTitle>
          {/* Centrar titulo */}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="email@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Mostrar el error del submit del formulario si existe */}
              {loginError && <FormMessage>{loginError}</FormMessage>}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-800 hover:cursor-pointer" // Boton de ancho completo
                type="submit"
              >
                Iniciar Sesion
              </Button>
              <div className="text-center mt-4">
                <Link
                  href="/auth/register"
                  className="text-sm text-blue-600 hover:underline"
                >
                  ¿No tienes cuenta? Regístrate
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
