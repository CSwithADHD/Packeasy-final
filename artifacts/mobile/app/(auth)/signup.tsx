import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthShell } from "@/components/auth/AuthShell";
import { SocialRow } from "@/components/auth/SocialRow";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <AuthShell
      title="Signup"
      footer={
        <>
          <SocialRow label="Or signup with" />
          <Text style={styles.bottomText}>
            Already have an account!{" "}
            <Link href="/(auth)/login" style={styles.bottomLink}>
              Login
            </Link>
          </Text>
        </>
      }
    >
      <AuthInput
        label="User Name"
        placeholder="User name"
        autoCapitalize="words"
        value={name}
        onChangeText={setName}
      />
      <AuthInput
        label="Email"
        placeholder="Email address"
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
      <AuthInput
        label="Confirm password"
        placeholder="Confirm password"
        isPassword
        value={confirm}
        onChangeText={setConfirm}
      />

      <Pressable
        onPress={() => router.replace("/")}
        style={({ pressed }) => [
          styles.primaryBtn,
          pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        ]}
      >
        <Text style={styles.primaryText}>Signup</Text>
      </Pressable>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: "#22c46a",
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
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
