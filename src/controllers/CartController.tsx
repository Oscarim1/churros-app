import type React from "react"
import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
  canjeado?: boolean
  points?: number
}

interface CartContextData {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  updateQuantity: (id: string, quantity: number) => void
}

const CartContext = createContext<CartContextData>({} as CartContextData)

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  // Cargar carrito desde AsyncStorage al iniciar
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem("cart")
        if (savedCart) {
          setCart(JSON.parse(savedCart))
        }
      } catch (error) {
        console.error("Error loading cart from storage:", error)
      }
    }

    loadCart()
  }, [])

  // Guardar carrito en AsyncStorage cuando cambie
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem("cart", JSON.stringify(cart))
      } catch (error) {
        console.error("Error saving cart to storage:", error)
      }
    }

    saveCart()
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.canjeado === item.canjeado,
      )

      if (existingItemIndex > -1) {
        const newCart = [...currentCart]
        newCart[existingItemIndex].quantity += item.quantity
        return newCart
      }

      return [...currentCart, item]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((currentCart) => {
      return currentCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    })
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextData {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

