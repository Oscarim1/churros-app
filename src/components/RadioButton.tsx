import type React from "react"
import { View, StyleSheet } from "react-native"

interface RadioButtonProps {
  selected: boolean
}

const RadioButton: React.FC<RadioButtonProps> = ({ selected }) => {
  return <View style={styles.container}>{selected && <View style={styles.selected} />}</View>
}

const styles = StyleSheet.create({
  container: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F47920",
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#F47920",
  },
})

export default RadioButton

