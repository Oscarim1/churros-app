"use client"

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

const CART_STORAGE_KEY = "churros_cuchito_cart"

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  // Cargar carrito desde AsyncStorage al iniciar
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY)
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          console.log("Loaded cart from storage:", parsedCart)
          setCart(parsedCart)
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
        console.log("Saving cart to storage:", cart)
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      } catch (error) {
        console.error("Error saving cart to storage:", error)
      }
    }

    saveCart()
  }, [cart])

  const addToCart = (item: CartItem) => {
    console.log("Adding to cart:", item)
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
    console.log("Removing from cart, id:", id)
    setCart((currentCart) => currentCart.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    console.log("Clearing cart")
    // Ensure we're setting to an empty array and also clear AsyncStorage
    setCart([])
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify([])).catch((error) =>
      console.error("Error clearing cart in storage:", error),
    )
  }

  const updateQuantity = (id: string, quantity: number) => {
    console.log("Updating quantity, id:", id, "quantity:", quantity)
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

