import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"
import type { LoginCredentials, User } from "../models/User"
import { Alert } from "react-native"

interface AuthContextData {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  loginAttempts: number
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)

  async function login(credentials: LoginCredentials): Promise<boolean> {
    if (loginAttempts >= 3) {
      Alert.alert("Error", "Has excedido el número máximo de intentos. Inténtalo más tarde.")
      return false
    }

    setLoading(true)
    try {
      const response = await fetch("http://134.209.125.62:80/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      })

      const data = await response.json()

      // Actualizado para manejar la nueva estructura de respuesta
      if (data.user && data.token) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          token: data.token,
        })
        setLoginAttempts(0)
        return true
      } else {
        setLoginAttempts((prev) => prev + 1)
        Alert.alert("Error", data.message || "Credenciales inválidas")
        return false
      }
    } catch (error) {
      console.error(error)
      Alert.alert("Error", "Ocurrió un error al intentar iniciar sesión")
      setLoginAttempts((prev) => prev + 1)
      return false
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, loginAttempts }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

