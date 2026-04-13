import React, { useRef, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ViewToken,
} from "react-native";
import { useApp } from "@/contexts/AppContext";
import { ReelCard, REEL_HEIGHT } from "@/components/ReelCard";

export default function FeedScreen() {
  const { reels, toggleLike, toggleSave } = useApp();
  const [activeReelId, setActiveReelId] = useState<string>(reels[0]?.id ?? "");

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 55 });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const top = viewableItems[0];
      if (top?.item?.id) setActiveReelId(top.item.id);
    },
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={REEL_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        renderItem={({ item }) => (
          <ReelCard
            reel={item}
            isActive={item.id === activeReelId}
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
    backgroundColor: "#141612",
  },
});
