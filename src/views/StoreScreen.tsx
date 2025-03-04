"use client"

import type React from "react"
import { useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar, // Importamos StatusBar
} from "react-native"
import { ProductProvider, useProducts } from "../controllers/ProductController"
import { Ionicons } from "@expo/vector-icons"

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Image source={require("../assets/logo.png")} style={styles.headerLogo} resizeMode="contain" />
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const CategoryFilter: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useProducts()

  return (
    <View style={styles.categoryWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryButton, selectedCategory === category.name && styles.selectedCategoryButton]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Text style={[styles.categoryText, selectedCategory === category.name && styles.selectedCategoryText]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  return (
    <View style={styles.productCard}>
      <Image
        source={{ uri: product.image_url }} // Cambiado de image a image_url
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>${product.price.toLocaleString()}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const ProductList: React.FC = () => {
  const { products, loading, selectedCategory } = useProducts()

  const filteredProducts = products.filter((product) => product.category === selectedCategory)

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F47920" />
      </View>
    )
  }

  return (
    <FlatList
      data={filteredProducts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard product={item} />}
      contentContainerStyle={styles.productList}
    />
  )
}

const StoreScreenContent: React.FC = () => {
  const { fetchProducts } = useProducts()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <View style={styles.container}>
      {/* Configuramos StatusBar para que use el estilo oscuro */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <CategoryFilter />
        <ProductList />
      </SafeAreaView>
    </View>
  )
}

const StoreScreen: React.FC = () => {
  return (
    <ProductProvider>
      <StoreScreenContent />
    </ProductProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    ...Platform.select({
      ios: {
        marginTop: 3, // Reducido a 3 para iOS
      },
      android: {
        marginTop: 35, // Se mantiene en 35 para Android
      },
    }),
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  headerIcons: {
    flexDirection: "row",
  },
  menuButton: {
    marginRight: 15,
  },
  cartButton: {},
  categoryWrapper: {
    height: 60, // Altura fija para el contenedor
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  categoriesContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center", // Centra verticalmente los botones
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12, // Aumentado el espacio entre botones
    backgroundColor: "#F5F5F5",
    height: 40, // Altura fija para los botones
    justifyContent: "center", // Centra el texto verticalmente
  },
  selectedCategoryButton: {
    backgroundColor: "#333333",
  },
  categoryText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500", // Texto un poco más grueso
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  productList: {
    padding: 8,
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 0.5, // Agregamos un borde sutil para iOS
        borderColor: "rgba(0,0,0,0.1)", // Color del borde semi-transparente
      },
      android: {
        elevation: 2,
      },
    }),
  },
  productImage: {
    width: "100%",
    height: 200,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  productPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  addButton: {
    backgroundColor: "#F47920",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default StoreScreen

