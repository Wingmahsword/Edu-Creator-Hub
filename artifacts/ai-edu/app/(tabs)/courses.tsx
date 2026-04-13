import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp, Course } from "@/contexts/AppContext";
import { CourseCard } from "@/components/CourseCard";

const CATEGORIES = ["All", "Prompt Engineering", "Machine Learning", "Deep Learning", "Generative AI", "AI Applications", "AI Fundamentals", "AI Ethics"];

const PARTNER_LABELS: Record<string, string> = {
  coursera: "Coursera",
  anthropic: "Anthropic",
  google: "Google",
  internal: "EduAI",
};

const PARTNER_COLORS: Record<string, string> = {
  coursera: "#0056D2",
  anthropic: "#C46A3F",
  google: "#4285F4",
  internal: "#7A9E87",
};

const PARTNER_ICONS: Record<string, string> = {
  coursera: "C",
  anthropic: "A",
  google: "G",
  internal: "E",
};

function PartnerBadge({ partner }: { partner: string }) {
  const color = PARTNER_COLORS[partner] || "#7A9E87";
  const label = PARTNER_LABELS[partner] || partner;
  const icon = PARTNER_ICONS[partner] || "?";
  return (
    <View style={[styles.partnerBadge, { backgroundColor: color + "15", borderColor: color + "40" }]}>
      <View style={[styles.partnerIcon, { backgroundColor: color }]}>
        <Text style={styles.partnerIconText}>{icon}</Text>
      </View>
      <Text style={[styles.partnerLabel, { color }]}>{label}</Text>
    </View>
  );
}

function CoinBadge({ coins }: { coins: number }) {
  const colors = useColors();
  return (
    <View style={[styles.coinBadge, { backgroundColor: "#F9EDE6", borderColor: "#C46A3F30" }]}>
      <Text style={styles.coinEmoji}>🪙</Text>
      <Text style={[styles.coinCount, { color: "#C46A3F" }]}>{coins}</Text>
    </View>
  );
}

function EnrollSuccessModal({
  visible,
  coins,
  courseName,
  onClose,
}: {
  visible: boolean;
  coins: number;
  courseName: string;
  onClose: () => void;
}) {
  const colors = useColors();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.successCard, { backgroundColor: colors.card }]}>
          <View style={styles.successIcon}>
            <Text style={{ fontSize: 40 }}>🎉</Text>
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>Enrolled!</Text>
          <Text style={[styles.successSubtitle, { color: colors.mutedForeground }]} numberOfLines={2}>
            {courseName}
          </Text>

          <View style={[styles.rewardRow, { backgroundColor: "#F9EDE6", borderColor: "#C46A3F30", borderWidth: 1 }]}>
            <Text style={{ fontSize: 24 }}>🪙</Text>
            <View>
              <Text style={[styles.rewardTitle, { color: "#C46A3F" }]}>+{coins} coins earned!</Text>
              <Text style={[styles.rewardSub, { color: colors.mutedForeground }]}>Added to your wallet</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.successBtn, { backgroundColor: colors.primary }]}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.successBtnText}>Start Learning</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function WelcomeBonusModal({
  visible,
  onClaim,
}: {
  visible: boolean;
  onClaim: () => void;
}) {
  const colors = useColors();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClaim}>
      <View style={styles.modalOverlay}>
        <View style={[styles.welcomeCard, { backgroundColor: colors.card }]}>
          <View style={[styles.welcomeHeader, { backgroundColor: colors.primary + "15" }]}>
            <Text style={{ fontSize: 48 }}>🎁</Text>
          </View>
          <View style={styles.welcomeBody}>
            <Text style={[styles.welcomeTitle, { color: colors.foreground }]}>Welcome Bonus!</Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.mutedForeground }]}>
              Sign up today and get a head start on your AI learning journey.
            </Text>

            <View style={[styles.bonusAmount, { backgroundColor: "#F9EDE6" }]}>
              <Text style={{ fontSize: 32 }}>🪙</Text>
              <Text style={[styles.bonusNumber, { color: "#C46A3F" }]}>100</Text>
              <Text style={[styles.bonusLabel, { color: colors.mutedForeground }]}>coins</Text>
            </View>

            <View style={styles.bonusPerks}>
              {[
                "Enroll in any partner course",
                "Unlock premium playground features",
                "Earn more coins by completing courses",
              ].map((perk, i) => (
                <View key={i} style={styles.perkRow}>
                  <View style={[styles.perkDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.perkText, { color: colors.foreground }]}>{perk}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.claimBtn, { backgroundColor: colors.primary }]}
              onPress={onClaim}
              activeOpacity={0.85}
            >
              <Text style={styles.claimBtnText}>Claim 100 Coins</Text>
              <Text style={{ fontSize: 18 }}>🪙</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function PartnerSection({ title, partner, courses, onEnroll }: {
  title: string;
  partner: string;
  courses: Course[];
  onEnroll: (course: Course) => void;
}) {
  const colors = useColors();
  if (courses.length === 0) return null;
  return (
    <View style={styles.partnerSection}>
      <View style={styles.partnerSectionHeader}>
        <PartnerBadge partner={partner} />
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingRight: 16 }}
      >
        {courses.map((course) => (
          <PartnerCourseCard key={course.id} course={course} onEnroll={() => onEnroll(course)} />
        ))}
      </ScrollView>
    </View>
  );
}

function PartnerCourseCard({ course, onEnroll }: { course: Course; onEnroll: () => void }) {
  const colors = useColors();
  const accentColor = PARTNER_COLORS[course.partner] || colors.primary;

  const THUMB_COLORS: Record<string, string> = {
    prompt: "#EEF3EF",
    ml: "#F9EDE6",
    dl: "#F5EDE8",
    apps: "#FBF3EE",
    ethics: "#EBF2EE",
    llm: "#F2EEE8",
  };

  return (
    <TouchableOpacity
      style={[styles.partnerCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.9}
      onPress={onEnroll}
    >
      <View style={[styles.partnerCardThumb, { backgroundColor: THUMB_COLORS[course.thumbnail] || "#EEF3EF" }]}>
        <View style={[styles.partnerCardAccent, { backgroundColor: accentColor, opacity: 0.15 }]} />
        <Feather name="play-circle" size={28} color={accentColor} />
        <View style={[styles.partnerCardBadge, { backgroundColor: accentColor + "20" }]}>
          <Text style={[styles.partnerCardBadgeText, { color: accentColor }]}>
            {PARTNER_LABELS[course.partner]}
          </Text>
        </View>
      </View>
      <View style={styles.partnerCardBody}>
        <Text style={[styles.partnerCardCategory, { color: accentColor }]}>{course.category}</Text>
        <Text style={[styles.partnerCardTitle, { color: colors.foreground }]} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={[styles.partnerCardInstructor, { color: colors.mutedForeground }]}>
          {course.instructor}
        </Text>
        <View style={styles.partnerCardMeta}>
          <Ionicons name="star" size={12} color="#C46A3F" />
          <Text style={[styles.partnerCardMetaText, { color: colors.foreground }]}>{course.rating}</Text>
          <Text style={[styles.partnerCardMetaDot, { color: colors.mutedForeground }]}>·</Text>
          <Text style={[styles.partnerCardMetaText, { color: colors.mutedForeground }]}>
            {course.students >= 1000000
              ? (course.students / 1000000).toFixed(1) + "M"
              : (course.students / 1000).toFixed(0) + "k"} students
          </Text>
        </View>
        <View style={styles.partnerCardFooter}>
          {course.enrolled ? (
            <View style={[styles.enrolledBadge, { backgroundColor: colors.secondary }]}>
              <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
              <Text style={[styles.enrolledText, { color: colors.primary }]}>Enrolled</Text>
            </View>
          ) : (
            <View style={[styles.rewardChip, { backgroundColor: "#F9EDE6" }]}>
              <Text style={{ fontSize: 11 }}>🪙</Text>
              <Text style={[styles.rewardChipText, { color: "#C46A3F" }]}>+{course.rewardCoins}</Text>
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.enrollBtn,
              { backgroundColor: course.enrolled ? colors.secondary : accentColor },
            ]}
            onPress={onEnroll}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.enrollBtnText,
                { color: course.enrolled ? colors.primary : "#fff" },
              ]}
            >
              {course.enrolled ? "Continue" : "Enroll"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CoursesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { courses, enrollCourse, coins, hasClaimedWelcomeBonus, claimWelcomeBonus } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showWelcome, setShowWelcome] = useState(!hasClaimedWelcomeBonus);
  const [enrollSuccess, setEnrollSuccess] = useState<{ visible: boolean; coins: number; name: string }>({
    visible: false,
    coins: 0,
    name: "",
  });

  const topPadding = Platform.OS === "web" ? 77 : insets.top;

  const handleEnroll = (course: Course) => {
    if (course.enrolled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { coinsEarned } = enrollCourse(course.id);
    if (coinsEarned > 0) {
      setEnrollSuccess({ visible: true, coins: coinsEarned, name: course.title });
    }
  };

  const handleClaimBonus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    claimWelcomeBonus();
    setShowWelcome(false);
  };

  const enrolled = courses.filter((c) => c.enrolled && c.progress > 0);
  const courseraList = courses.filter((c) => c.partner === "coursera");
  const anthropicList = courses.filter((c) => c.partner === "anthropic");
  const googleList = courses.filter((c) => c.partner === "google");
  const filtered =
    selectedCategory === "All"
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <WelcomeBonusModal
        visible={showWelcome && !hasClaimedWelcomeBonus}
        onClaim={handleClaimBonus}
      />
      <EnrollSuccessModal
        visible={enrollSuccess.visible}
        coins={enrollSuccess.coins}
        courseName={enrollSuccess.name}
        onClose={() => setEnrollSuccess({ visible: false, coins: 0, name: "" })}
      />

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
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Your Learning Path</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Courses</Text>
          </View>
          <CoinBadge coins={coins} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 100 : 100) },
        ]}
      >
        {enrolled.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Continue Learning</Text>
            {enrolled.map((course) => (
              <CourseCard key={course.id} course={course} onPress={() => {}} />
            ))}
          </View>
        )}

        <PartnerSection
          title="Coursera"
          partner="coursera"
          courses={courseraList}
          onEnroll={handleEnroll}
        />

        <PartnerSection
          title="Anthropic"
          partner="anthropic"
          courses={anthropicList}
          onEnroll={handleEnroll}
        />

        <PartnerSection
          title="Google"
          partner="google"
          courses={googleList}
          onEnroll={handleEnroll}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Browse All</Text>
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

          <View style={{ marginTop: 12 }}>
            {filtered.map((course) => (
              <TouchableOpacity key={course.id} onPress={() => handleEnroll(course)} activeOpacity={1}>
                <CourseCard course={course} onPress={() => handleEnroll(course)} />
              </TouchableOpacity>
            ))}
          </View>
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
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  greeting: { fontSize: 13, marginBottom: 2 },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  coinEmoji: { fontSize: 15 },
  coinCount: { fontSize: 15, fontWeight: "800" },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 24, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  seeAll: { fontSize: 13, fontWeight: "600" },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  categoryPillText: { fontSize: 13, fontWeight: "600" },
  partnerSection: { marginBottom: 24, gap: 12 },
  partnerSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  partnerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  partnerIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  partnerIconText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  partnerLabel: { fontSize: 13, fontWeight: "700" },
  partnerCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    width: 240,
  },
  partnerCardThumb: {
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  partnerCardAccent: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -60,
    right: -40,
  },
  partnerCardBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  partnerCardBadgeText: { fontSize: 10, fontWeight: "700" },
  partnerCardBody: { padding: 12, gap: 3 },
  partnerCardCategory: { fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.4 },
  partnerCardTitle: { fontSize: 14, fontWeight: "700", lineHeight: 19 },
  partnerCardInstructor: { fontSize: 12 },
  partnerCardMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  partnerCardMetaText: { fontSize: 12 },
  partnerCardMetaDot: { fontSize: 12 },
  partnerCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  enrolledBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  enrolledText: { fontSize: 12, fontWeight: "600" },
  rewardChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rewardChipText: { fontSize: 12, fontWeight: "700" },
  enrollBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  enrollBtnText: { fontSize: 12, fontWeight: "700" },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  successCard: {
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 12,
    width: "100%",
    maxWidth: 340,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9EDE6",
  },
  successTitle: { fontSize: 24, fontWeight: "800" },
  successSubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    width: "100%",
  },
  rewardTitle: { fontSize: 16, fontWeight: "800" },
  rewardSub: { fontSize: 12, marginTop: 2 },
  successBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 4,
  },
  successBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  welcomeCard: {
    borderRadius: 28,
    overflow: "hidden",
    width: "100%",
    maxWidth: 360,
  },
  welcomeHeader: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  welcomeBody: {
    padding: 24,
    gap: 16,
  },
  welcomeTitle: { fontSize: 26, fontWeight: "800", textAlign: "center" },
  welcomeSubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  bonusAmount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 20,
    borderRadius: 18,
  },
  bonusNumber: { fontSize: 40, fontWeight: "900" },
  bonusLabel: { fontSize: 18, fontWeight: "600" },
  bonusPerks: { gap: 10 },
  perkRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  perkDot: { width: 6, height: 6, borderRadius: 3 },
  perkText: { fontSize: 14, lineHeight: 20, flex: 1 },
  claimBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 4,
  },
  claimBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
