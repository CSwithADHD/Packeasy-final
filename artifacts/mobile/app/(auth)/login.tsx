import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthShell } from "@/components/auth/AuthShell";
import { SocialRow } from "@/components/auth/SocialRow";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  return (
    <AuthShell
      title="Login"
      footer={
        <>
          <SocialRow label="Or login with" />
          <Text style={styles.bottomText}>
            Don't have an account?{" "}
            <Link href="/(auth)/signup" style={styles.bottomLink}>
              Signup
            </Link>
          </Text>
        </>
      }
    >
      <AuthInput
        label="Email"
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <AuthInput
        label="Password"
        placeholder="Password"
        isPassword
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.optionsRow}>
        <View style={styles.rememberRow}>
          <Switch
            value={remember}
            onValueChange={setRemember}
            trackColor={{ false: "rgba(255,255,255,0.3)", true: "#22c46a" }}
            thumbColor="#ffffff"
            ios_backgroundColor="rgba(255,255,255,0.3)"
          />
          <Text style={styles.rememberText}>Remember me</Text>
        </View>
        <Pressable hitSlop={8}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => router.replace("/(tabs)")}
        style={({ pressed }) => [
          styles.primaryBtn,
          pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        ]}
      >
        <Text style={styles.primaryText}>Login</Text>
      </Pressable>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rememberText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  forgotText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  primaryBtn: {
    backgroundColor: "#22c46a",
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "#ffffff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  bottomText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
  bottomLink: {
    color: "#22c46a",
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
});
