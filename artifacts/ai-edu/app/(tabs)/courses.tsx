import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";
import { CourseCard } from "@/components/CourseCard";

const CATEGORIES = ["All", "Prompt Engineering", "Machine Learning", "Deep Learning", "AI Applications", "AI Ethics"];

export default function CoursesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { courses, enrollCourse } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const enrolled = courses.filter((c) => c.enrolled);
  const featured = courses.slice(0, 3);
  const filtered =
    selectedCategory === "All"
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  const topPadding = Platform.OS === "web" ? 77 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPadding + 16, paddingBottom: insets.bottom + (Platform.OS === "web" ? 100 : 100) },
        ]}
      >
        <View style={styles.headerSection}>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Welcome back</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Your Learning Path</Text>
        </View>

        {enrolled.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Continue Learning</Text>
            {enrolled.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={() => {}}
              />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Featured Courses</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 16 }}
          >
            {featured.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                variant="featured"
                onPress={() => enrollCourse(course.id)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Browse by Topic</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  selectedCategory === cat
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.secondary, borderColor: colors.border, borderWidth: 1 },
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    { color: selectedCategory === cat ? "#fff" : colors.foreground },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ marginTop: 12, gap: 0 }}>
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={() => enrollCourse(course.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 4,
  },
  headerSection: {
    marginBottom: 8,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  section: {
    marginTop: 20,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "600",
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
