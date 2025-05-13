import { Suspense } from "react"
import LoginForm from "@/components/auth/login/LoginForm"

function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Cargando formulario de login...</div>}>
      <LoginForm/>
    </Suspense>
  )
}

export default LoginPage