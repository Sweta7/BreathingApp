import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
//import "./BreatheCircle.css";

export default function Index() {
  const CYCLE_TIME = 8000; // 8 seconds for full cycle (in + out)

  const [phase, setPhase] = useState("in"); // "in" or "out"

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p === "in" ? "out" : "in"));
    }, CYCLE_TIME / 2);
    return () => clearInterval(interval);
  }, []);
  return (
    <View style={styles.container}>
      {/* <div className="breathe-container"> */}
      <div style={styles.breatheContainer}>
        <svg style={styles.breatheSvg} width="300" height="300">
          <circle
            style={styles.breatheCircle}
            cx="150"
            cy="150"
            r={phase === "in" ? 120 : 80}
            fill="url(#grad1)"
            stroke="#7f7fff"
            strokeWidth="10"
          />
          <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b3c6ff" />
              <stop offset="100%" stopColor="#7f7fff" />
            </radialGradient>
          </defs>
        </svg>
        <div style={styles.breatheText}>
          {phase === "in" ? (
            <>
              Breathe
              <br />
              in
            </>
          ) : (
            "Breathe out"
          )}
        </div>
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  breatheContainer: {
    position: "relative",
    width: 300,
    height: 300,
    margin: 40,
  },
  breatheSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  breatheCircle: {
    transition: "all 4s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  breatheText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    fontSize: "2rem",
    fontFamily: "sans-serif",
    textAlign: "center",
    pointerEvents: "none",
    userSelect: "none",
  },
});
