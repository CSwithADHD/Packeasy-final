import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
};

export function SocialRow({ label }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>{label}</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.row}>
        <SocialBtn>
          <FontAwesome name="google" size={22} color="#ffffff" />
        </SocialBtn>
        <SocialBtn>
          <Ionicons name="logo-apple" size={24} color="#ffffff" />
        </SocialBtn>
        <SocialBtn>
          <FontAwesome5 name="facebook-f" size={22} color="#ffffff" />
        </SocialBtn>
      </View>
    </View>
  );
}

function SocialBtn({ children }: { children: React.ReactNode }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.7 }]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  dividerText: {
    color: "#ffffff",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
  },
  btn: {
    width: 70,
    height: 52,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
});
