export interface User {
  id: string
  email: string
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
  }
  token: string
  message?: string
}
