import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";

const GRID_SIZE = 3;
const TOTAL_HOLES = GRID_SIZE * GRID_SIZE;
const MOLE_EMOJIS = ["🐹", "🐰", "🦊", "🐸", "🐻", "🐼", "🐨", "🐵"];
const MOLE_INTERVAL_OPTIONS = [300, 500, 800, 1200, 2000];
const DURATION_OPTIONS = [15, 30, 45, 60]; // seconds

export default function WhackAMoleScreen() {
  const router = useRouter();
  const [moleIndex, setMoleIndex] = useState(
    Math.floor(Math.random() * TOTAL_HOLES)
  );
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pause, setPause] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [interval, setIntervalValue] = useState(MOLE_INTERVAL_OPTIONS[2]);
  const [mole, setMole] = useState(MOLE_EMOJIS[0]);
  const [moleInterval, setMoleInterval] = useState(MOLE_INTERVAL_OPTIONS[2]);
  const [duration, setDuration] = useState(DURATION_OPTIONS[1]);
  const [timeLeft, setTimeLeft] = useState(DURATION_OPTIONS[1]);
  const [gameOver, setGameOver] = useState(false);
  const [bgColor, setBgColor] = useState(new Animated.Value(0)); // 0: normal, 1: green, -1: red
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!playing) return;
    const intervalId = setInterval(() => {
      setMoleIndex(Math.floor(Math.random() * TOTAL_HOLES));
    }, moleInterval);
    return () => clearInterval(intervalId);
  }, [playing, moleInterval]);

  useEffect(() => {
    if (!playing) return;
    if (timeLeft <= 0) {
      setPlaying(false);
      setGameOver(true);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, timeLeft]);

  const flashBg = (color: "green" | "red") => {
    Animated.sequence([
      Animated.timing(bgColor, {
        toValue: color === "green" ? 1 : -1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(bgColor, {
        toValue: 0,
        duration: 350,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleWhack = (index: number) => {
    if (!playing) return;
    if (index === moleIndex) {
      setScore(score + 1);
      setMoleIndex(Math.floor(Math.random() * TOTAL_HOLES));
      flashBg("green");
    } else {
      flashBg("red");
    }
  };

  const handleRestart = () => {
    setScore(0);
    setPlaying(true);
    setPause(false);
    setGameOver(false);
    setTimeLeft(duration);
    setMoleIndex(Math.floor(Math.random() * TOTAL_HOLES));
  };

  const handleStop = () => {
    setPlaying(false);
    setPause(true);
  };

  const handleStart = () => {
    setMoleInterval(interval);
    setShowSetup(false);
    setScore(0);
    setPlaying(true);
    setPause(false);
    setGameOver(false);
    setTimeLeft(duration);
    setMoleIndex(Math.floor(Math.random() * TOTAL_HOLES));
  };

  const bgColorInterpolate = bgColor.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["#ffdddd", "#f0f0f0", "#ddffdd"],
  });

  if (showSetup) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>O'yin sozlamalari</Text>
        <Text style={styles.label}>Mole tezligi (sekund):</Text>
        <View style={styles.selectRow}>
          {MOLE_INTERVAL_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.selectOption,
                interval === opt && styles.selectedOption,
              ]}
              onPress={() => setIntervalValue(opt)}
            >
              <Text style={styles.selectText}>{opt / 1000} sm</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>O'yin davomiyligi (sekund):</Text>
        <View style={styles.selectRow}>
          {DURATION_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.selectOption,
                duration === opt && styles.selectedOption,
              ]}
              onPress={() => setDuration(opt)}
            >
              <Text style={styles.selectText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Mole turi:</Text>
        <View style={styles.moleRow}>
          {MOLE_EMOJIS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={[styles.moleOption, mole === emoji && styles.selectedMole]}
              onPress={() => setMole(emoji)}
            >
              <Text style={styles.mole}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonRow}>
          <Button title="Boshlash" onPress={handleStart} />
          <Button title="Orqaga" onPress={() => router.replace("/")} />
        </View>
      </View>
    );
  }

  if (gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>O'yin tugadi!</Text>
        <Text style={styles.score}>Natija: {score}</Text>
        <Button title="Qaytadan o'ynash" onPress={handleRestart} />
        <Button title="Orqaga" onPress={() => router.replace("/")} />
      </View>
    );
  }

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: bgColorInterpolate }]}
    >
      <Text style={styles.title}>Whack A Mole!</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.timer}>Qolgan vaqt: {timeLeft} s</Text>
      <View style={styles.grid}>
        {Array.from({ length: TOTAL_HOLES }).map((_, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.hole}
            onPress={() => handleWhack(idx)}
            activeOpacity={0.7}
          >
            {moleIndex === idx && <Text style={styles.mole}>{mole}</Text>}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonRow}>
        <Button
          title={playing ? "To'xtatish" : pause ? "Davom ettirish" : "Qaytadan"}
          onPress={() => {
            if (!playing && !pause) {
              handleRestart();
            } else if (playing) {
              handleStop();
            } else if (!playing && pause) {
              setPlaying(true);
              setPause(false);
            }
          }}
        />
        <Button title="Orqaga" onPress={() => router.replace("/")} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 16 },
  score: { fontSize: 20, marginBottom: 8 },
  timer: { fontSize: 18, marginBottom: 16, color: "#333" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 250,
    height: 250,
    marginBottom: 24,
  },
  hole: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    borderRadius: 40,
    backgroundColor: "#eee",
  },
  mole: { fontSize: 36 },
  buttonRow: { flexDirection: "row", gap: 16, alignItems: "center" },
  label: { fontSize: 18, marginBottom: 8, marginTop: 16 },
  selectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
    marginTop: 8,
  },
  selectOption: {
    marginHorizontal: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "#fff",
  },
  selectedOption: {
    borderColor: "#007bff",
    backgroundColor: "#e0f0ff",
  },
  selectText: { fontSize: 18 },
  moleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
    marginTop: 8,
  },
  moleOption: {
    marginHorizontal: 6,
    padding: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "#fff",
  },
  selectedMole: {
    borderColor: "#007bff",
    backgroundColor: "#e0f0ff",
  },
});
