import type React from "react"
import { createContext, useState, useContext, type ReactNode, useEffect, useCallback } from "react"
import type { Product, Category } from "../models/Product"
import { useAuth } from "./AuthController"
import { Alert } from "react-native"

interface ProductContextData {
  products: Product[]
  categories: Category[]
  loading: boolean
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  fetchProducts: () => Promise<void>
}

const ProductContext = createContext<ProductContextData>({} as ProductContextData)

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Churros")
  const { user } = useAuth()

  const fetchProducts = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch("http://134.209.125.62:80/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })

      const data = await response.json()

      if (data) {
        setProducts(data)

        // Extraer categorías únicas de los productos
        const uniqueCategories = [...new Set(data.map((product: Product) => product.category))]
        setCategories(
          uniqueCategories.map((name: string, index: number) => ({
            id: index.toString(),
            name,
          })),
        )
      }
    } catch (error) {
      console.error(error)
      Alert.alert("Error", "Ocurrió un error al cargar los productos")
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user, fetchProducts])

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        selectedCategory,
        setSelectedCategory,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts(): ProductContextData {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProducts debe ser usado dentro de un ProductProvider")
  }
  return context
}

