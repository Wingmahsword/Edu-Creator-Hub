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
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");

// Full bleed — content goes UNDER the floating tab bar
export const REEL_HEIGHT = height;

const TAB_BAR_HEIGHT = Platform.OS === "web" ? 84 : 83;

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

// Each reel gets its own warm dark palette with a dominant accent colour
const REEL_PALETTES: Record<string, { bg: string; mid: string; orb: string; orb2: string }> = {
  r1: { bg: "#141612", mid: "#1E2A1F", orb: "#7A9E87", orb2: "#A8C5B0" },
  r2: { bg: "#1A1108", mid: "#2C1E0E", orb: "#C46A3F", orb2: "#E8956D" },
  r3: { bg: "#12181A", mid: "#1A2830", orb: "#5A8A9A", orb2: "#8ABAC8" },
  r4: { bg: "#1A1310", mid: "#2C1E16", orb: "#C4834A", orb2: "#E8A86D" },
  r5: { bg: "#161412", mid: "#241E18", orb: "#9A7B5E", orb2: "#C4A882" },
};

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
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
  const palette = REEL_PALETTES[reel.thumbnail] || REEL_PALETTES.r1;

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.7)).current;
  const pulseRef = useRef<Animated.CompositeAnimation | null>(null);
  const progressRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isActive) {
      progressAnim.setValue(0);

      progressRef.current = Animated.timing(progressAnim, {
        toValue: 1,
        duration: reel.durationSeconds * 1000,
        useNativeDriver: false,
      });
      progressRef.current.start();

      pulseRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.7, duration: 900, useNativeDriver: true }),
        ])
      );
      pulseRef.current.start();
    } else {
      progressRef.current?.stop();
      pulseRef.current?.stop();
      progressAnim.setValue(0);
      pulseAnim.setValue(0.7);
    }

    return () => {
      progressRef.current?.stop();
      pulseRef.current?.stop();
    };
  }, [isActive, reel.id]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLike();
  };
  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSave();
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      {/* Background layers */}
      <View style={[styles.midLayer, { backgroundColor: palette.mid }]} />

      {/* Large translucent orb — top left */}
      <View
        style={[
          styles.orb,
          styles.orbTopLeft,
          { backgroundColor: palette.orb },
        ]}
      />
      {/* Small orb — bottom right */}
      <View
        style={[
          styles.orb,
          styles.orbBottomRight,
          { backgroundColor: palette.orb2 },
        ]}
      />
      {/* Tiny accent orb — centre */}
      <View
        style={[
          styles.orb,
          styles.orbCentre,
          { backgroundColor: palette.orb },
        ]}
      />

      {/* Bottom gradient — deep fade to black so text is always readable */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.88)"]}
        locations={[0.35, 0.65, 1]}
        style={styles.bottomGradient}
      />

      {/* Top gradient — subtle fade for tags */}
      <LinearGradient
        colors={["rgba(0,0,0,0.45)", "transparent"]}
        locations={[0, 1]}
        style={styles.topGradient}
      />

      {/* Progress bar — full bleed at very top */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: progressWidth, backgroundColor: palette.orb2 },
          ]}
        />
      </View>

      {/* Play / pause visual */}
      <Animated.View style={[styles.centerIcon, { opacity: pulseAnim }]}>
        <View style={styles.centerIconInner}>
          <Feather name={isActive ? "pause" : "play"} size={26} color="rgba(255,255,255,0.9)" />
        </View>
      </Animated.View>

      {/* HUD overlay */}
      <View style={styles.hud}>
        {/* Top row: tags + duration */}
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

        {/* Side actions */}
        <View style={styles.sideActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.8}>
            <Ionicons
              name={reel.liked ? "heart" : "heart-outline"}
              size={30}
              color={reel.liked ? "#E8956D" : "rgba(255,255,255,0.95)"}
            />
            <Text style={styles.actionCount}>{formatCount(reel.likes + (reel.liked ? 1 : 0))}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Ionicons name="chatbubble-outline" size={28} color="rgba(255,255,255,0.95)" />
            <Text style={styles.actionCount}>{formatCount(reel.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Feather name="send" size={26} color="rgba(255,255,255,0.95)" />
            <Text style={styles.actionCount}>{formatCount(reel.shares)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleSave} activeOpacity={0.8}>
            <Ionicons
              name={reel.saved ? "bookmark" : "bookmark-outline"}
              size={28}
              color={reel.saved ? palette.orb2 : "rgba(255,255,255,0.95)"}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom content */}
        <View style={styles.bottomContent}>
          <TouchableOpacity style={styles.creatorRow} onPress={onCreatorPress} activeOpacity={0.85}>
            <View style={[styles.avatarRing, { borderColor: palette.orb2 + "80" }]}>
              <View style={[styles.avatarFill, { backgroundColor: palette.orb }]}>
                <Text style={styles.avatarText}>{reel.creatorAvatar}</Text>
              </View>
            </View>
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>{reel.creator}</Text>
              <Text style={styles.creatorHandle}>{reel.creatorHandle}</Text>
            </View>
            {isActive && (
              <View style={[styles.playingPill, { borderColor: palette.orb2 + "60" }]}>
                <Animated.View style={[styles.playingDot, { backgroundColor: palette.orb2, opacity: pulseAnim }]} />
                <Text style={[styles.playingText, { color: palette.orb2 }]}>Playing</Text>
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
    height: REEL_HEIGHT,
    overflow: "hidden",
  },
  midLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  orb: {
    position: "absolute",
    borderRadius: 9999,
  },
  orbTopLeft: {
    width: width * 1.1,
    height: width * 1.1,
    top: -width * 0.35,
    left: -width * 0.25,
    opacity: 0.18,
  },
  orbBottomRight: {
    width: width * 0.75,
    height: width * 0.75,
    bottom: height * 0.12,
    right: -width * 0.25,
    opacity: 0.14,
  },
  orbCentre: {
    width: width * 0.55,
    height: width * 0.55,
    top: height * 0.3,
    left: width * 0.22,
    opacity: 0.09,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.55,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.2,
  },
  progressTrack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.15)",
    zIndex: 20,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  centerIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -28 }, { translateY: -28 }],
    zIndex: 5,
  },
  centerIconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  hud: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    paddingTop: Platform.OS === "web" ? 24 : 56,
    paddingBottom: TAB_BAR_HEIGHT + 24,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  tagRow: {
    flexDirection: "row",
    gap: 6,
    flex: 1,
    flexWrap: "wrap",
  },
  tagPill: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "600",
  },
  durationBadge: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 8,
  },
  durationText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
  },
  sideActions: {
    position: "absolute",
    right: 14,
    bottom: TAB_BAR_HEIGHT + 200,
    alignItems: "center",
    gap: 24,
    zIndex: 12,
  },
  actionBtn: {
    alignItems: "center",
    gap: 5,
  },
  actionCount: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "700",
  },
  bottomContent: {
    gap: 10,
    paddingRight: 72,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  avatarRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFill: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 13,
    fontWeight: "800",
  },
  creatorInfo: {
    flex: 1,
    gap: 1,
  },
  creatorName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  creatorHandle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
  },
  playingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
  },
  playingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  playingText: {
    fontSize: 11,
    fontWeight: "700",
  },
  reelTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
  },
  reelDesc: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    lineHeight: 18,
  },
});
