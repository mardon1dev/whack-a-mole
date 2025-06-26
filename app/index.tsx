import React from "react";
import { View, Image, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/mole.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
      <Button
        title="O'yinga o'tish"
        onPress={() => router.replace("/whack-a-mole")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  image: { width: 250, height: 250, marginBottom: 32 },
});
