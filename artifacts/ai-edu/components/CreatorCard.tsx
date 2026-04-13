import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: number;
  courses: number;
  reels: number;
  following: boolean;
  verified: boolean;
  specialty: string;
}

const AVATAR_COLORS = ["#6C63FF", "#2563EB", "#EC4899", "#F97316", "#10B981", "#8B5CF6"];

function getAvatarColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function formatFollowers(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "k";
  return n.toString();
}

interface Props {
  creator: Creator;
  onFollow: () => void;
  onPress: () => void;
}

export function CreatorCard({ creator, onFollow, onPress }: Props) {
  const colors = useColors();
  const avatarColor = getAvatarColor(creator.id);

  const handleFollow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onFollow();
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{creator.avatar}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.foreground }]}>{creator.name}</Text>
            {creator.verified && (
              <Ionicons name="checkmark-circle" size={15} color={colors.primary} style={{ marginLeft: 4 }} />
            )}
          </View>
          <Text style={[styles.handle, { color: colors.mutedForeground }]}>{creator.handle}</Text>
          <View style={[styles.specialtyBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.specialtyText, { color: colors.primary }]}>{creator.specialty}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.followBtn,
            creator.following
              ? { backgroundColor: colors.secondary, borderColor: colors.primary, borderWidth: 1 }
              : { backgroundColor: colors.primary },
          ]}
          onPress={handleFollow}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.followText,
              { color: creator.following ? colors.primary : "#fff" },
            ]}
          >
            {creator.following ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.bio, { color: colors.mutedForeground }]} numberOfLines={2}>{creator.bio}</Text>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{formatFollowers(creator.followers)}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Followers</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{creator.courses}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Courses</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{creator.reels}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Reels</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
  },
  handle: {
    fontSize: 12,
  },
  specialtyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  specialtyText: {
    fontSize: 10,
    fontWeight: "700",
  },
  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  followText: {
    fontSize: 13,
    fontWeight: "700",
  },
  bio: {
    fontSize: 13,
    lineHeight: 18,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
  },
});
