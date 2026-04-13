import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const COURSE_COLORS: Record<string, string> = {
  prompt: "#EEF0FF",
  ml: "#E8F4FF",
  dl: "#FDF2F8",
  apps: "#FFF7ED",
  ethics: "#F0FDF4",
  llm: "#F5F3FF",
};

const COURSE_ACCENT: Record<string, string> = {
  prompt: "#6C63FF",
  ml: "#2563EB",
  dl: "#EC4899",
  apps: "#F97316",
  ethics: "#10B981",
  llm: "#8B5CF6",
};

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "#10B981",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  enrolled: boolean;
  progress: number;
  rating: number;
  students: number;
  thumbnail: string;
  description: string;
  tags: string[];
}

interface Props {
  course: Course;
  onPress: () => void;
  variant?: "card" | "featured";
}

export function CourseCard({ course, onPress, variant = "card" }: Props) {
  const colors = useColors();
  const bg = COURSE_COLORS[course.thumbnail] || "#EEF0FF";
  const accent = COURSE_ACCENT[course.thumbnail] || colors.primary;

  if (variant === "featured") {
    return (
      <TouchableOpacity style={[styles.featured, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.9}>
        <View style={[styles.featuredAccent, { backgroundColor: accent, opacity: 0.12 }]} />
        <View style={styles.featuredContent}>
          <View style={[styles.categoryBadge, { backgroundColor: accent + "20" }]}>
            <Text style={[styles.categoryText, { color: accent }]}>{course.category}</Text>
          </View>
          <Text style={[styles.featuredTitle, { color: "#1a1a2e" }]} numberOfLines={2}>{course.title}</Text>
          <Text style={styles.featuredInstructor}>by {course.instructor}</Text>
          <View style={styles.featuredMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.metaText}>{course.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="users" size={12} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{(course.students / 1000).toFixed(1)}k</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="clock" size={12} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{course.duration}</Text>
            </View>
          </View>
          {course.enrolled && course.progress > 0 && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: accent + "30" }]}>
                <View style={[styles.progressFill, { width: `${course.progress}%` as any, backgroundColor: accent }]} />
              </View>
              <Text style={[styles.progressText, { color: accent }]}>{course.progress}%</Text>
            </View>
          )}
        </View>
        <View style={[styles.featuredIcon, { backgroundColor: accent + "20" }]}>
          <Feather name="play-circle" size={36} color={accent} />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.cardThumbnail, { backgroundColor: bg }]}>
        <View style={[styles.cardAccent, { backgroundColor: accent, opacity: 0.15 }]} />
        <Feather name="play-circle" size={28} color={accent} />
        <View style={[styles.levelBadge, { backgroundColor: LEVEL_COLORS[course.level] + "20" }]}>
          <Text style={[styles.levelText, { color: LEVEL_COLORS[course.level] }]}>{course.level}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardCategory, { color: accent }]}>{course.category}</Text>
        <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={2}>{course.title}</Text>
        <Text style={[styles.cardInstructor, { color: colors.mutedForeground }]}>{course.instructor}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.metaText, { color: colors.foreground }]}>{course.rating}</Text>
          </View>
          <Text style={[styles.metaSep, { color: colors.mutedForeground }]}>·</Text>
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{course.lessons} lessons</Text>
          <Text style={[styles.metaSep, { color: colors.mutedForeground }]}>·</Text>
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{course.duration}</Text>
        </View>
        {course.enrolled && course.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: accent + "25" }]}>
              <View style={[styles.progressFill, { width: `${course.progress}%` as any, backgroundColor: accent }]} />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  featured: {
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    minWidth: 280,
    maxWidth: 320,
  },
  featuredAccent: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -50,
    right: -50,
  },
  featuredContent: {
    flex: 1,
    gap: 6,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  featuredInstructor: {
    fontSize: 13,
    color: "#666",
  },
  featuredMeta: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  featuredIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  cardThumbnail: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cardAccent: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -60,
    right: -40,
  },
  levelBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "700",
  },
  cardContent: {
    padding: 14,
    gap: 4,
  },
  cardCategory: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  cardInstructor: {
    fontSize: 12,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 12,
  },
  metaSep: {
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
