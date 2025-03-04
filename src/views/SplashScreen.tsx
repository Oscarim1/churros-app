"use client"

import type React from "react"
import { useEffect } from "react"
import { View, Image, StyleSheet, StatusBar } from "react-native" // Importamos StatusBar
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"

type RootStackParamList = {
  Splash: undefined
  Login: undefined
  Store: undefined
}

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, "Splash">

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login")
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <View style={styles.container}>
      {/* Configuramos StatusBar para que use el estilo oscuro */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 200,
    height: 200,
  },
})

export default SplashScreen

