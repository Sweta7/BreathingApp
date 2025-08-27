import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

type Phase = "inhale" | "exhale";

// radius bounds
const R_MIN = 80;
const R_MAX = 120;

// durations (milliseconds)
const D_INHALE = 4000; // 4s inhale
const D_EXHALE = 4000; // 4s exhale

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Index() {
  const [phase, setPhase] = useState<Phase>("inhale");

  const radius = useRef(new Animated.Value(R_MIN)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;

  const fadeText = () =>
    Animated.sequence([
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);

  useEffect(() => {
    let isMounted = true;

    const runCycle = () => {
      if (!isMounted) return;

      // INHALE
      setPhase("inhale");
      Animated.parallel([
        Animated.timing(radius, {
          toValue: R_MAX,
          duration: D_INHALE,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        fadeText(),
      ]).start(() => {
        if (!isMounted) return;

        // EXHALE
        setPhase("exhale");
        Animated.parallel([
          Animated.timing(radius, {
            toValue: R_MIN,
            duration: D_EXHALE,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
          fadeText(),
        ]).start(() => {
          if (!isMounted) return;
          runCycle(); // loop forever
        });
      });
    };

    runCycle();

    return () => {
      isMounted = false;
      radius.stopAnimation();
      textOpacity.stopAnimation();
    };
  }, [radius, textOpacity]);

  const caption = phase === "inhale" ? "Breathe in" : "Breathe out";

  return (
    <View style={styles.screen}>
      <View style={styles.wrapper}>
        <Svg width={300} height={300}>
          <Defs>
            <RadialGradient id="grad1" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#b3c6ff" />
              <Stop offset="100%" stopColor="#7f7fff" />
            </RadialGradient>
          </Defs>

          <AnimatedCircle
            cx={150}
            cy={150}
            r={radius}
            fill="url(#grad1)"
            stroke="#7f7fff"
            strokeWidth={10}
          />
        </Svg>

        <Animated.View style={[styles.captionWrap, { opacity: textOpacity }]}>
          <Text style={styles.caption}>{caption}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f1020",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#7f7fff",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    ...Platform.select({ android: { elevation: 8 } }),
  },
  captionWrap: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  caption: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
