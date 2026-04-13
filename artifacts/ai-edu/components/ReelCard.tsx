import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

const { width, height } = Dimensions.get("window");
export const REEL_HEIGHT = Platform.OS === "web" ? 600 : height;

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
  durationSeconds: number;
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
  isActive: boolean;
  onLike: () => void;
  onSave: () => void;
  onCreatorPress: () => void;
}

export function ReelCard({ reel, isActive, onLike, onSave, onCreatorPress }: Props) {
  const colors = useColors();
  const bgColors = REEL_COLORS[reel.thumbnail] || REEL_COLORS.r1;

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isActive) {
      progressAnim.setValue(0);
      animRef.current = Animated.timing(progressAnim, {
        toValue: 1,
        duration: reel.durationSeconds * 1000,
        useNativeDriver: false,
      });
      animRef.current.start();

      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.85, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => {
        animRef.current?.stop();
        pulse.stop();
        pulseAnim.setValue(1);
      };
    } else {
      animRef.current?.stop();
      progressAnim.setValue(0);
    }
  }, [isActive, reel.id]);

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLike();
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSave();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.container, { height: REEL_HEIGHT }]}>
      <View style={[styles.background, { backgroundColor: bgColors[0] }]}>
        <View style={[styles.gradientOverlay, { backgroundColor: bgColors[1], opacity: 0.6 }]} />
        <View style={[styles.accentOrb, { backgroundColor: bgColors[2], opacity: 0.25 }]} />
        <View style={[styles.accentOrb2, { backgroundColor: bgColors[2], opacity: 0.12 }]} />

        <Animated.View style={[styles.playIconContainer, { opacity: isActive ? pulseAnim : 0.3 }]}>
          <View style={styles.playCircle}>
            <Feather name={isActive ? "pause" : "play"} size={28} color="rgba(255,255,255,0.9)" />
          </View>
        </Animated.View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: progressWidth, backgroundColor: bgColors[2] },
          ]}
        />
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
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{reel.duration}</Text>
          </View>
        </View>

        <View style={styles.sideActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.8}>
            <Ionicons
              name={reel.liked ? "heart" : "heart-outline"}
              size={28}
              color={reel.liked ? "#E8956D" : "#fff"}
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
            <View style={[styles.avatarCircle, { backgroundColor: bgColors[2] }]}>
              <Text style={styles.avatarText}>{reel.creatorAvatar}</Text>
            </View>
            <View>
              <Text style={styles.creatorName}>{reel.creator}</Text>
              <Text style={styles.creatorHandle}>{reel.creatorHandle}</Text>
            </View>
            {isActive && (
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Playing</Text>
              </View>
            )}
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
    backgroundColor: "#1A1512",
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
    width: width * 1.3,
    height: width * 1.3,
    borderRadius: width * 0.65,
    top: -width * 0.35,
    left: -width * 0.15,
  },
  accentOrb2: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    bottom: -width * 0.1,
    right: -width * 0.2,
  },
  playIconContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  playCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
  },
  progressTrack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: "rgba(255,255,255,0.2)",
    zIndex: 10,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "web" ? 80 : 64,
    paddingBottom: Platform.OS === "web" ? 100 : 120,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
  },
  tagPill: {
    backgroundColor: "rgba(122,158,135,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(122,158,135,0.3)",
  },
  tagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  durationBadge: {
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
  },
  durationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  sideActions: {
    position: "absolute",
    right: 14,
    bottom: Platform.OS === "web" ? 140 : 180,
    alignItems: "center",
    gap: 22,
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
    paddingRight: 64,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
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
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(122,158,135,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(168,197,176,0.5)",
    marginLeft: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#A8C5B0",
  },
  liveText: {
    color: "#A8C5B0",
    fontSize: 10,
    fontWeight: "700",
  },
  reelTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  reelDesc: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    lineHeight: 18,
  },
});
