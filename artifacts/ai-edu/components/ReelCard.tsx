import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

const { width, height } = Dimensions.get("window");
const REEL_HEIGHT = Platform.OS === "web" ? 600 : height;

interface ReelItem {
  id: string;
  creator: string;
  creatorHandle: string;
  creatorAvatar: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  duration: string;
  tags: string[];
  liked: boolean;
  saved: boolean;
  thumbnail: string;
}

const REEL_COLORS: Record<string, string[]> = {
  r1: ["#1A1512", "#2C2318", "#7A9E87"],
  r2: ["#1C1410", "#332518", "#C46A3F"],
  r3: ["#181A16", "#242D20", "#5A8A6A"],
  r4: ["#1C1614", "#2E2018", "#E8956D"],
  r5: ["#1A1816", "#2A2420", "#A07860"],
};

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

interface Props {
  reel: ReelItem;
  onLike: () => void;
  onSave: () => void;
  onCreatorPress: () => void;
}

export function ReelCard({ reel, onLike, onSave, onCreatorPress }: Props) {
  const colors = useColors();
  const bgColors = REEL_COLORS[reel.thumbnail] || REEL_COLORS.r1;

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLike();
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSave();
  };

  return (
    <View style={[styles.container, { height: REEL_HEIGHT }]}>
      <View
        style={[
          styles.background,
          {
            backgroundColor: bgColors[0],
          },
        ]}
      >
        <View
          style={[
            styles.gradientOverlay,
            { backgroundColor: bgColors[1], opacity: 0.6 },
          ]}
        />
        <View
          style={[
            styles.accentOrb,
            { backgroundColor: bgColors[2], opacity: 0.3 },
          ]}
        />
        <View style={styles.playIconContainer}>
          <Feather name="play-circle" size={56} color="rgba(255,255,255,0.15)" />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{reel.duration}</Text>
        </View>
      </View>

      <View style={styles.overlay}>
        <View style={styles.topRow}>
          <View style={styles.tagRow}>
            {reel.tags.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sideActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.8}>
            <Ionicons
              name={reel.liked ? "heart" : "heart-outline"}
              size={28}
              color={reel.liked ? "#FF4B6A" : "#fff"}
            />
            <Text style={styles.actionCount}>{formatCount(reel.likes + (reel.liked ? 1 : 0))}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Ionicons name="chatbubble-outline" size={26} color="#fff" />
            <Text style={styles.actionCount}>{formatCount(reel.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Feather name="share-2" size={24} color="#fff" />
            <Text style={styles.actionCount}>{formatCount(reel.shares)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleSave} activeOpacity={0.8}>
            <Ionicons
              name={reel.saved ? "bookmark" : "bookmark-outline"}
              size={26}
              color={reel.saved ? "#A8C5B0" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContent}>
          <TouchableOpacity style={styles.creatorRow} onPress={onCreatorPress} activeOpacity={0.85}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{reel.creatorAvatar}</Text>
            </View>
            <View>
              <Text style={styles.creatorName}>{reel.creator}</Text>
              <Text style={styles.creatorHandle}>{reel.creatorHandle}</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.reelTitle} numberOfLines={2}>{reel.title}</Text>
          <Text style={styles.reelDesc} numberOfLines={2}>{reel.description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    backgroundColor: "#0F0F1A",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  accentOrb: {
    position: "absolute",
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    top: -width * 0.3,
    left: -width * 0.1,
  },
  playIconContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -28 }, { translateY: -28 }],
  },
  durationBadge: {
    position: "absolute",
    top: Platform.OS === "web" ? 77 : 60,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  durationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "web" ? 77 : 60,
    paddingBottom: Platform.OS === "web" ? 100 : 120,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagPill: {
    backgroundColor: "rgba(122,158,135,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  sideActions: {
    position: "absolute",
    right: 16,
    bottom: Platform.OS === "web" ? 140 : 180,
    alignItems: "center",
    gap: 20,
  },
  actionBtn: {
    alignItems: "center",
    gap: 4,
  },
  actionCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomContent: {
    gap: 8,
    paddingRight: 60,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  creatorName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  creatorHandle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  reelTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  reelDesc: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    lineHeight: 18,
  },
});
