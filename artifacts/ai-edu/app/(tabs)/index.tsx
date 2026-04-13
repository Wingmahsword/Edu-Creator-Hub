import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/contexts/AppContext";
import { ReelCard } from "@/components/ReelCard";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");
const REEL_HEIGHT = Platform.OS === "web" ? 600 : height;

export default function FeedScreen() {
  const { reels, toggleLike, toggleSave } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={REEL_HEIGHT}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <ReelCard
            reel={item}
            onLike={() => toggleLike(item.id)}
            onSave={() => toggleSave(item.id)}
            onCreatorPress={() => {}}
          />
        )}
        getItemLayout={(_, index) => ({
          length: REEL_HEIGHT,
          offset: REEL_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F1A",
  },
});
