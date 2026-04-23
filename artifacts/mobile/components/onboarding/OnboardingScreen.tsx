import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ONBOARDING_TEAL = "#1AA8C4";
export const ONBOARDING_TEAL_DARK = "#0F8AA3";

type Props = {
  image: ImageSourcePropType;
  title: string;
  step: 1 | 2 | 3;
  nextHref: string;
  skipHref: string;
};

export function OnboardingScreen({
  image,
  title,
  step,
  nextHref,
  skipHref,
}: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <View style={styles.illustrationWrap}>
        <Image source={image} style={styles.illustration} resizeMode="contain" />
      </View>

      <View style={styles.dotsRow}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === step ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => router.replace(skipHref as never)}
            style={({ pressed }) => [
              styles.skipBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push(nextHref as never)}
            style={({ pressed }) => [
              styles.nextBtn,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Feather name="chevron-right" size={26} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ONBOARDING_TEAL,
  },
  illustrationWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 22,
    backgroundColor: "#ffffff",
  },
  dotInactive: {
    width: 8,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    gap: 36,
  },
  title: {
    color: ONBOARDING_TEAL,
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipBtn: {
    backgroundColor: "#EAEAEA",
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 10,
  },
  skipText: {
    color: "#6B6B6B",
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  nextBtn: {
    backgroundColor: ONBOARDING_TEAL,
    width: 56,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
