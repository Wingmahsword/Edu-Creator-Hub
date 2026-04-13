import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";
import { CreatorCard } from "@/components/CreatorCard";

const TOPICS = ["All", "Machine Learning", "Prompt Engineering", "Deep Learning", "AI Applications"];

export default function CreatorsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { creators, toggleFollow } = useApp();
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");

  const topPadding = Platform.OS === "web" ? 77 : insets.top;

  const filtered = creators.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.specialty.toLowerCase().includes(search.toLowerCase());
    const matchTopic = topic === "All" || c.specialty === topic;
    return matchSearch && matchTopic;
  });

  const following = creators.filter((c) => c.following);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Creators</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            value={search}
            onChangeText={setSearch}
            placeholder="Search creators..."
            placeholderTextColor={colors.mutedForeground}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 100 : 100) },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicRow}
        >
          {TOPICS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.topicPill,
                topic === t
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: colors.secondary, borderColor: colors.border, borderWidth: 1 },
              ]}
              onPress={() => setTopic(t)}
              activeOpacity={0.85}
            >
              <Text style={[styles.topicText, { color: topic === t ? "#fff" : colors.foreground }]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {following.length > 0 && topic === "All" && !search && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Following</Text>
            {following.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                onFollow={() => toggleFollow(creator.id)}
                onPress={() => {}}
              />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {topic === "All" && !search ? "Discover Creators" : `Results (${filtered.length})`}
          </Text>
          {filtered.length === 0 ? (
            <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="users" size={32} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No creators found</Text>
            </View>
          ) : (
            filtered.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                onFollow={() => toggleFollow(creator.id)}
                onPress={() => {}}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },
  content: { paddingHorizontal: 16, paddingTop: 12 },
  topicRow: { gap: 8, paddingBottom: 4 },
  topicPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  topicText: { fontSize: 13, fontWeight: "600" },
  section: { marginTop: 20, gap: 0 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
  },
  emptyText: { fontSize: 14 },
});
