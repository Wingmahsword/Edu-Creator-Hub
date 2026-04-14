import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "play.rectangle", selected: "play.rectangle.fill" }} />
        <Label>Feed</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="courses">
        <Icon sf={{ default: "book", selected: "book.fill" }} />
        <Label>Courses</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="playground">
        <Icon sf={{ default: "sparkles", selected: "sparkles" }} />
        <Label>Playground</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="creators">
        <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
        <Label>Creators</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const isAndroid = Platform.OS === "android";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "rgba(200,195,190,0.7)",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: isWeb ? 84 : 83,
          ...(Platform.OS !== "web" ? { shadowOpacity: 0 } : {}),
        },
        tabBarBackground: () => (
          <BlurView
            intensity={isWeb ? 60 : 80}
            tint="dark"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isAndroid
                  ? "rgba(20,22,18,0.88)"
                  : "rgba(20,22,18,0.55)",
                borderTopWidth: 0.5,
                borderTopColor: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              },
            ]}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: isWeb ? 12 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarActiveTintColor: "#A8C5B0",
          tabBarInactiveTintColor: "rgba(200,200,200,0.5)",
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView
                name={focused ? "play.rectangle.fill" : "play.rectangle"}
                tintColor={color}
                size={22}
              />
            ) : (
              <Ionicons name={focused ? "play" : "play-outline"} size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView name={focused ? "book.fill" : "book"} tintColor={color} size={22} />
            ) : (
              <Ionicons name={focused ? "book" : "book-outline"} size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="playground"
        options={{
          title: "Playground",
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView name="sparkles" tintColor={color} size={22} />
            ) : (
              <Feather name="cpu" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="creators"
        options={{
          title: "Creators",
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView name={focused ? "person.2.fill" : "person.2"} tintColor={color} size={22} />
            ) : (
              <Ionicons name={focused ? "people" : "people-outline"} size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
