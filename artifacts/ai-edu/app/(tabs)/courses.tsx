import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Animated,
  Share,
  TextInput,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";
import { useApp, Course } from "@/contexts/AppContext";
import { CourseCard } from "@/components/CourseCard";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const CATEGORIES = ["All", "Prompt Engineering", "Machine Learning", "Deep Learning", "Generative AI", "AI Ethics"];

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

const THUMB_BG: Record<string, string> = {
  prompt: "#EEF3EF",
  ml: "#F9EDE6",
  dl: "#F5EDE8",
  apps: "#FBF3EE",
  ethics: "#EBF2EE",
  llm: "#F2EEE8",
};

const THUMB_ACCENT: Record<string, string> = {
  prompt: "#7A9E87",
  ml: "#C46A3F",
  dl: "#B8634E",
  apps: "#D4855A",
  ethics: "#5A8A6A",
  llm: "#9A7B5E",
};

// Static extra detail per course id prefix (for the detail sheet)
const COURSE_EXTRAS: Record<string, { learn: string[]; modules: string[] }> = {
  coursera_ml: {
    learn: ["Build and train neural networks", "Apply ML to real-world problems", "Use Python & TensorFlow", "Understand regression & classification", "Deploy ML models in production"],
    modules: ["Week 1: Introduction to ML", "Week 2: Regression & Gradient Descent", "Week 3: Classification Algorithms", "Week 4: Neural Network Basics", "Week 5: Advanced Topics"],
  },
  coursera_ai: {
    learn: ["What AI can and cannot do today", "Navigate AI strategy at your company", "Identify high-value AI projects", "Work with AI teams effectively", "Manage AI project timelines"],
    modules: ["Module 1: AI for Everyone Intro", "Module 2: Building AI Projects", "Module 3: AI in Your Company", "Module 4: AI & Society"],
  },
  coursera_dl: {
    learn: ["Deep neural network architectures", "Hyperparameter tuning techniques", "CNNs, RNNs, Transformers", "Sequence models for NLP", "Real-world deep learning pipelines"],
    modules: ["Course 1: Neural Nets & Deep Learning", "Course 2: Improving Deep Networks", "Course 3: Structuring ML Projects", "Course 4: CNNs", "Course 5: Sequence Models"],
  },
  anthropic_prompt: {
    learn: ["Craft precise, effective prompts for Claude", "Use system prompts and context windows", "Reduce hallucinations with prompt design", "Multi-turn conversation patterns", "Evaluate prompt quality systematically"],
    modules: ["Lesson 1: Claude Fundamentals", "Lesson 2: Prompt Structure", "Lesson 3: System Prompts", "Lesson 4: Chain-of-Thought", "Lesson 5: Evaluation & Iteration"],
  },
  anthropic_safety: {
    learn: ["What Constitutional AI means", "How RLHF and CAI differ", "Build safer, more aligned systems", "Red-teaming AI models", "AI ethics frameworks in practice"],
    modules: ["Part 1: AI Safety Overview", "Part 2: Constitutional AI Deep Dive", "Part 3: RLHF & Alignment", "Part 4: Real-World Safety Cases"],
  },
  google_mlcc: {
    learn: ["TensorFlow fundamentals hands-on", "Feature engineering best practices", "Training, evaluation & validation", "Regularization and generalization", "Production ML on Google Cloud"],
    modules: ["Framing ML Problems", "Descending into ML", "Reducing Loss", "First Steps with TensorFlow", "Feature Crosses & Embeddings"],
  },
  google_genai: {
    learn: ["LLM foundations and architecture", "Generative AI use cases & design", "Responsible AI practices at Google", "Prompt design for generative tasks", "Deploy generative models on Vertex AI"],
    modules: ["Intro to Generative AI", "Intro to Large Language Models", "Intro to Responsible AI", "Generative AI Fundamentals Badge", "Advanced Topics & Labs"],
  },
  google_gemini: {
    learn: ["Call the Gemini API from scratch", "Multimodal inputs: text, images, code", "Build chat applications with context", "Function calling & structured output", "Production API best practices"],
    modules: ["Setup & Authentication", "Text Generation Basics", "Multimodal Capabilities", "Chat & Memory", "Advanced API Features"],
  },
};

function getExtras(courseId: string) {
  return COURSE_EXTRAS[courseId] ?? {
    learn: ["Master core concepts", "Apply knowledge to real projects", "Build practical skills", "Earn a certificate of completion"],
    modules: ["Module 1: Foundations", "Module 2: Core Skills", "Module 3: Advanced Topics", "Module 4: Final Project"],
  };
}

// ─── Share helper ────────────────────────────────────────────────────────────
async function shareCourse(course: Course) {
  const url = `https://learnai.app/courses/${course.id}`;
  const msg = `🎓 I'm learning "${course.title}" by ${course.instructor} on LearnAI!\n\nJoin me and earn coins while mastering AI.\n${url}`;
  try {
    if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: course.title, text: msg, url });
    } else {
      await Share.share({ message: msg, url, title: course.title });
    }
  } catch (_) {}
}

// ─── Small reusable badges ────────────────────────────────────────────────────
function PartnerBadge({ partner }: { partner: string }) {
  const color = PARTNER_COLORS[partner] || "#7A9E87";
  return (
    <View style={[sb.partnerBadge, { backgroundColor: color + "15", borderColor: color + "40" }]}>
      <View style={[sb.partnerIcon, { backgroundColor: color }]}>
        <Text style={sb.partnerIconText}>{PARTNER_ICONS[partner] || "?"}</Text>
      </View>
      <Text style={[sb.partnerLabel, { color }]}>{PARTNER_LABELS[partner] || partner}</Text>
    </View>
  );
}

function CoinBadge({ coins }: { coins: number }) {
  return (
    <View style={[sb.coinBadge, { backgroundColor: "#F9EDE6", borderColor: "#C46A3F30" }]}>
      <Text style={sb.coinEmoji}>🪙</Text>
      <Text style={[sb.coinCount, { color: "#C46A3F" }]}>{coins}</Text>
    </View>
  );
}

// ─── Course Detail Bottom Sheet ───────────────────────────────────────────────
function CourseDetailSheet({
  course,
  visible,
  onClose,
  onEnroll,
  wishlisted,
  onWishlist,
}: {
  course: Course | null;
  visible: boolean;
  onClose: () => void;
  onEnroll: () => void;
  wishlisted: boolean;
  onWishlist: () => void;
}) {
  const colors = useColors();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 200 }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 260, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!course) return null;

  const bg = THUMB_BG[course.thumbnail] || "#EEF3EF";
  const accent = THUMB_ACCENT[course.thumbnail] || "#7A9E87";
  const partnerColor = PARTNER_COLORS[course.partner] || accent;
  const extras = getExtras(course.id);
  const studentStr = course.students >= 1000000
    ? (course.students / 1000000).toFixed(1) + "M"
    : (course.students / 1000).toFixed(0) + "k";

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1 }}>
        {/* Dimmed backdrop */}
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.55)", opacity: backdropAnim }]}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
        </Animated.View>

        {/* Sheet */}
        <Animated.View
          style={[
            ds.sheet,
            { backgroundColor: colors.card, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Drag handle */}
          <View style={ds.handleBar} />

          <ScrollView showsVerticalScrollIndicator={false} bounces>
            {/* Hero thumbnail */}
            <View style={[ds.heroThumb, { backgroundColor: bg }]}>
              <LinearGradient
                colors={[accent + "40", accent + "10", "transparent"]}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={[ds.heroOrb, { backgroundColor: accent }]} />
              <View style={[ds.heroBadge, { backgroundColor: "rgba(0,0,0,0.35)" }]}>
                <Feather name="play-circle" size={44} color="#fff" />
              </View>
              {/* Top-right actions */}
              <View style={ds.heroActions}>
                <TouchableOpacity style={ds.heroActionBtn} onPress={onWishlist} activeOpacity={0.8}>
                  <Ionicons
                    name={wishlisted ? "bookmark" : "bookmark-outline"}
                    size={20}
                    color={wishlisted ? accent : "#fff"}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={ds.heroActionBtn} onPress={() => shareCourse(course)} activeOpacity={0.8}>
                  <Feather name="share-2" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={ds.heroActionBtn} onPress={onClose} activeOpacity={0.8}>
                  <Feather name="x" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
              {/* Partner badge overlay */}
              <View style={ds.heroPartner}>
                <PartnerBadge partner={course.partner} />
              </View>
            </View>

            <View style={ds.sheetBody}>
              {/* Category + level */}
              <View style={ds.metaRow}>
                <View style={[ds.catPill, { backgroundColor: accent + "18" }]}>
                  <Text style={[ds.catPillText, { color: accent }]}>{course.category}</Text>
                </View>
                <View style={[ds.catPill, { backgroundColor: "#F0F0F0" }]}>
                  <Text style={[ds.catPillText, { color: "#666" }]}>{course.level}</Text>
                </View>
              </View>

              <Text style={[ds.sheetTitle, { color: colors.foreground }]}>{course.title}</Text>
              <Text style={[ds.sheetInstructor, { color: colors.mutedForeground }]}>
                by {course.instructor}
              </Text>

              {/* Stats strip */}
              <View style={[ds.statsStrip, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <View style={ds.statItem}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={[ds.statValue, { color: colors.foreground }]}>{course.rating}</Text>
                  <Text style={[ds.statLabel, { color: colors.mutedForeground }]}>rating</Text>
                </View>
                <View style={[ds.statDivider, { backgroundColor: colors.border }]} />
                <View style={ds.statItem}>
                  <Feather name="users" size={13} color={colors.mutedForeground} />
                  <Text style={[ds.statValue, { color: colors.foreground }]}>{studentStr}</Text>
                  <Text style={[ds.statLabel, { color: colors.mutedForeground }]}>students</Text>
                </View>
                <View style={[ds.statDivider, { backgroundColor: colors.border }]} />
                <View style={ds.statItem}>
                  <Feather name="clock" size={13} color={colors.mutedForeground} />
                  <Text style={[ds.statValue, { color: colors.foreground }]}>{course.duration}</Text>
                  <Text style={[ds.statLabel, { color: colors.mutedForeground }]}>duration</Text>
                </View>
                <View style={[ds.statDivider, { backgroundColor: colors.border }]} />
                <View style={ds.statItem}>
                  <Feather name="book-open" size={13} color={colors.mutedForeground} />
                  <Text style={[ds.statValue, { color: colors.foreground }]}>{course.lessons}</Text>
                  <Text style={[ds.statLabel, { color: colors.mutedForeground }]}>lessons</Text>
                </View>
              </View>

              {/* Coin reward */}
              {!course.enrolled && (
                <View style={[ds.rewardBanner, { backgroundColor: "#FEF6F1", borderColor: "#E8956D40" }]}>
                  <Text style={{ fontSize: 22 }}>🪙</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[ds.rewardTitle, { color: "#C46A3F" }]}>Earn {course.rewardCoins} coins on enrollment</Text>
                    <Text style={[ds.rewardSub, { color: "#9C7060" }]}>Coins can unlock premium features & courses</Text>
                  </View>
                </View>
              )}

              {/* Description */}
              <View style={ds.section}>
                <Text style={[ds.sectionTitle, { color: colors.foreground }]}>About this course</Text>
                <Text style={[ds.sectionText, { color: colors.mutedForeground }]}>{course.description}</Text>
              </View>

              {/* What you'll learn */}
              <View style={[ds.section, { backgroundColor: colors.background, borderRadius: 14, padding: 16 }]}>
                <Text style={[ds.sectionTitle, { color: colors.foreground }]}>What you'll learn</Text>
                <View style={{ gap: 10, marginTop: 4 }}>
                  {extras.learn.map((item, i) => (
                    <View key={i} style={ds.learnRow}>
                      <View style={[ds.learnDot, { backgroundColor: accent }]}>
                        <Feather name="check" size={10} color="#fff" />
                      </View>
                      <Text style={[ds.learnText, { color: colors.foreground }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Curriculum */}
              <View style={ds.section}>
                <Text style={[ds.sectionTitle, { color: colors.foreground }]}>Curriculum</Text>
                <View style={{ gap: 8, marginTop: 4 }}>
                  {extras.modules.map((mod, i) => (
                    <View
                      key={i}
                      style={[ds.moduleRow, { backgroundColor: colors.background, borderColor: colors.border }]}
                    >
                      <View style={[ds.moduleNum, { backgroundColor: accent + "18" }]}>
                        <Text style={[ds.moduleNumText, { color: accent }]}>{i + 1}</Text>
                      </View>
                      <Text style={[ds.moduleText, { color: colors.foreground }]}>{mod}</Text>
                      <Feather name="lock" size={13} color={colors.mutedForeground} />
                    </View>
                  ))}
                </View>
              </View>

              {/* Share section */}
              <View style={ds.section}>
                <Text style={[ds.sectionTitle, { color: colors.foreground }]}>Share this course</Text>
                <Text style={[ds.sectionText, { color: colors.mutedForeground }]}>
                  Spread the knowledge — share with your network!
                </Text>
                <View style={ds.shareGrid}>
                  {[
                    { icon: "twitter", label: "Twitter/X", color: "#1DA1F2" },
                    { icon: "linkedin", label: "LinkedIn", color: "#0A66C2" },
                    { icon: "facebook", label: "Facebook", color: "#1877F2" },
                    { icon: "message-circle", label: "Message", color: "#25D366" },
                    { icon: "copy", label: "Copy link", color: "#9C9189" },
                  ].map(({ icon, label, color }) => (
                    <TouchableOpacity
                      key={label}
                      style={[ds.shareBtn, { backgroundColor: color + "12", borderColor: color + "30" }]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        shareCourse(course);
                      }}
                      activeOpacity={0.8}
                    >
                      <Feather name={icon as any} size={18} color={color} />
                      <Text style={[ds.shareBtnLabel, { color }]}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Sticky bottom CTA */}
          <View style={[ds.stickyCTA, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[ds.shareOutlineBtn, { borderColor: colors.border }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                shareCourse(course);
              }}
              activeOpacity={0.8}
            >
              <Feather name="share-2" size={18} color={colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                ds.enrollCTA,
                { backgroundColor: course.enrolled ? "#7A9E87" : partnerColor, flex: 1 },
              ]}
              onPress={() => {
                onEnroll();
                if (!course.enrolled) onClose();
              }}
              activeOpacity={0.88}
            >
              {course.enrolled ? (
                <>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={ds.enrollCTAText}>Continue Learning</Text>
                </>
              ) : (
                <>
                  <Feather name="zap" size={16} color="#fff" />
                  <Text style={ds.enrollCTAText}>Enroll • {course.rewardCoins} 🪙</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Enroll success modal ─────────────────────────────────────────────────────
function EnrollSuccessModal({
  visible, coins, courseName, onClose,
}: { visible: boolean; coins: number; courseName: string; onClose: () => void }) {
  const colors = useColors();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={ms.overlay}>
        <View style={[ms.card, { backgroundColor: colors.card }]}>
          <View style={ms.icon}><Text style={{ fontSize: 40 }}>🎉</Text></View>
          <Text style={[ms.title, { color: colors.foreground }]}>Enrolled!</Text>
          <Text style={[ms.subtitle, { color: colors.mutedForeground }]} numberOfLines={2}>{courseName}</Text>
          <View style={[ms.rewardRow, { backgroundColor: "#F9EDE6", borderColor: "#C46A3F30", borderWidth: 1 }]}>
            <Text style={{ fontSize: 24 }}>🪙</Text>
            <View>
              <Text style={[ms.rewardTitle, { color: "#C46A3F" }]}>+{coins} coins earned!</Text>
              <Text style={[ms.rewardSub, { color: colors.mutedForeground }]}>Added to your wallet</Text>
            </View>
          </View>
          <TouchableOpacity style={[ms.btn, { backgroundColor: "#7A9E87" }]} onPress={onClose} activeOpacity={0.85}>
            <Text style={ms.btnText}>Start Learning</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Welcome bonus modal ───────────────────────────────────────────────────────
function WelcomeBonusModal({ visible, onClaim }: { visible: boolean; onClaim: () => void }) {
  const colors = useColors();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClaim}>
      <View style={ms.overlay}>
        <View style={[ms.welcome, { backgroundColor: colors.card }]}>
          <View style={[ms.welcomeHeader, { backgroundColor: "#7A9E8715" }]}>
            <Text style={{ fontSize: 48 }}>🎁</Text>
          </View>
          <View style={ms.welcomeBody}>
            <Text style={[ms.welcomeTitle, { color: colors.foreground }]}>Welcome Bonus!</Text>
            <Text style={[ms.welcomeSub, { color: colors.mutedForeground }]}>
              Sign up today and get a head start on your AI learning journey.
            </Text>
            <View style={[ms.bonusAmt, { backgroundColor: "#F9EDE6" }]}>
              <Text style={{ fontSize: 32 }}>🪙</Text>
              <Text style={[ms.bonusNum, { color: "#C46A3F" }]}>100</Text>
              <Text style={[ms.bonusLabel, { color: colors.mutedForeground }]}>coins</Text>
            </View>
            {["Enroll in any partner course", "Unlock playground features", "Earn more by completing courses"].map((p, i) => (
              <View key={i} style={ms.perkRow}>
                <View style={[ms.perkDot, { backgroundColor: "#7A9E87" }]} />
                <Text style={[ms.perkText, { color: colors.foreground }]}>{p}</Text>
              </View>
            ))}
            <TouchableOpacity style={[ms.claimBtn, { backgroundColor: "#7A9E87" }]} onPress={onClaim} activeOpacity={0.85}>
              <Text style={ms.claimText}>Claim 100 Coins</Text>
              <Text style={{ fontSize: 18 }}>🪙</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Partner horizontal section ───────────────────────────────────────────────
function PartnerSection({
  partner, courses, onTap,
}: { partner: string; courses: Course[]; onTap: (c: Course) => void }) {
  const colors = useColors();
  if (courses.length === 0) return null;
  return (
    <View style={ls.partnerSection}>
      <View style={ls.partnerSectionHeader}>
        <PartnerBadge partner={partner} />
        <TouchableOpacity>
          <Text style={[ls.seeAll, { color: colors.primary }]}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingRight: 16 }}
      >
        {courses.map((c) => (
          <PartnerCourseCard key={c.id} course={c} onTap={() => onTap(c)} />
        ))}
      </ScrollView>
    </View>
  );
}

function PartnerCourseCard({ course, onTap }: { course: Course; onTap: () => void }) {
  const colors = useColors();
  const accentColor = PARTNER_COLORS[course.partner] || colors.primary;
  const bg = THUMB_BG[course.thumbnail] || "#EEF3EF";
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onTap}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          ls.partnerCard,
          { backgroundColor: colors.card, borderColor: colors.border, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={[ls.partnerCardThumb, { backgroundColor: bg }]}>
          <View style={[ls.partnerCardAccent, { backgroundColor: accentColor, opacity: 0.15 }]} />
          <Feather name="play-circle" size={28} color={accentColor} />
          <View style={[ls.partnerCardBadge, { backgroundColor: accentColor + "20" }]}>
            <Text style={[ls.partnerCardBadgeText, { color: accentColor }]}>
              {PARTNER_LABELS[course.partner]}
            </Text>
          </View>
        </View>
        <View style={ls.partnerCardBody}>
          <Text style={[ls.partnerCardCategory, { color: accentColor }]}>{course.category}</Text>
          <Text style={[ls.partnerCardTitle, { color: colors.foreground }]} numberOfLines={2}>{course.title}</Text>
          <Text style={[ls.partnerCardInstructor, { color: colors.mutedForeground }]}>{course.instructor}</Text>
          <View style={ls.partnerCardMeta}>
            <Ionicons name="star" size={12} color="#C46A3F" />
            <Text style={[ls.partnerCardMetaText, { color: colors.foreground }]}>{course.rating}</Text>
            <Text style={[ls.partnerCardMetaDot, { color: colors.mutedForeground }]}>·</Text>
            <Text style={[ls.partnerCardMetaText, { color: colors.mutedForeground }]}>
              {course.students >= 1000000
                ? (course.students / 1000000).toFixed(1) + "M"
                : (course.students / 1000).toFixed(0) + "k"} students
            </Text>
          </View>
          <View style={ls.partnerCardFooter}>
            {course.enrolled ? (
              <View style={[ls.enrolledBadge, { backgroundColor: colors.secondary }]}>
                <Ionicons name="checkmark-circle" size={13} color="#7A9E87" />
                <Text style={[ls.enrolledText, { color: "#7A9E87" }]}>Enrolled</Text>
              </View>
            ) : (
              <View style={[ls.rewardChip, { backgroundColor: "#F9EDE6" }]}>
                <Text style={{ fontSize: 11 }}>🪙</Text>
                <Text style={[ls.rewardChipText, { color: "#C46A3F" }]}>+{course.rewardCoins}</Text>
              </View>
            )}
            <View style={ls.shareRowBtn}>
              <TouchableOpacity
                style={[ls.shareIconBtn, { borderColor: accentColor + "30" }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  shareCourse(course);
                }}
                activeOpacity={0.8}
              >
                <Feather name="share-2" size={13} color={accentColor} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[ls.enrollBtn, { backgroundColor: course.enrolled ? colors.secondary : accentColor }]}
                onPress={onTap}
                activeOpacity={0.85}
              >
                <Text style={[ls.enrollBtnText, { color: course.enrolled ? "#7A9E87" : "#fff" }]}>
                  {course.enrolled ? "Continue" : "Enroll"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function CoursesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { courses, enrollCourse, coins, hasClaimedWelcomeBonus, claimWelcomeBonus } = useApp();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showWelcome, setShowWelcome] = useState(!hasClaimedWelcomeBonus);
  const [enrollSuccess, setEnrollSuccess] = useState<{ visible: boolean; coins: number; name: string }>({ visible: false, coins: 0, name: "" });
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const topPadding = Platform.OS === "web" ? 77 : insets.top;

  const handleEnroll = useCallback((course: Course) => {
    if (course.enrolled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { coinsEarned } = enrollCourse(course.id);
    if (coinsEarned > 0) {
      setEnrollSuccess({ visible: true, coins: coinsEarned, name: course.title });
    }
  }, [enrollCourse]);

  const handleTapCourse = (course: Course) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDetailCourse(course);
    setDetailVisible(true);
  };

  const handleClaimBonus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    claimWelcomeBonus();
    setShowWelcome(false);
  };

  const toggleWishlist = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const enrolled = courses.filter((c) => c.enrolled && c.progress > 0);
  const courseraList = courses.filter((c) => c.partner === "coursera");
  const anthropicList = courses.filter((c) => c.partner === "anthropic");
  const googleList = courses.filter((c) => c.partner === "google");

  const filtered = courses.filter((c) => {
    const matchesCat = selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch = search.trim() === "" || c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <View style={[ls.container, { backgroundColor: colors.background }]}>
      <WelcomeBonusModal visible={showWelcome && !hasClaimedWelcomeBonus} onClaim={handleClaimBonus} />
      <EnrollSuccessModal
        visible={enrollSuccess.visible}
        coins={enrollSuccess.coins}
        courseName={enrollSuccess.name}
        onClose={() => setEnrollSuccess({ visible: false, coins: 0, name: "" })}
      />
      {detailCourse && (
        <CourseDetailSheet
          course={detailCourse}
          visible={detailVisible}
          onClose={() => setDetailVisible(false)}
          onEnroll={() => handleEnroll(detailCourse)}
          wishlisted={wishlist.includes(detailCourse.id)}
          onWishlist={() => toggleWishlist(detailCourse.id)}
        />
      )}

      {/* Header */}
      <View style={[ls.header, { paddingTop: topPadding + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={ls.headerTop}>
          <View>
            <Text style={[ls.greeting, { color: colors.mutedForeground }]}>Your Learning Path</Text>
            <Text style={[ls.title, { color: colors.foreground }]}>Courses</Text>
          </View>
          <CoinBadge coins={coins} />
        </View>

        {/* Search bar */}
        <View style={[ls.searchBar, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="search" size={15} color={colors.mutedForeground} />
          <TextInput
            style={[ls.searchInput, { color: colors.foreground }]}
            placeholder="Search courses or instructors…"
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x-circle" size={15} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[ls.content, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Continue learning */}
        {enrolled.length > 0 && search === "" && selectedCategory === "All" && (
          <View style={ls.section}>
            <Text style={[ls.sectionTitle, { color: colors.foreground }]}>Continue Learning</Text>
            {enrolled.map((course) => (
              <TouchableOpacity key={course.id} onPress={() => handleTapCourse(course)} activeOpacity={0.9}>
                <CourseCard course={course} onPress={() => handleTapCourse(course)} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Partner sections — only show when not searching */}
        {search === "" && selectedCategory === "All" && (
          <>
            <PartnerSection partner="coursera" courses={courseraList} onTap={handleTapCourse} />
            <PartnerSection partner="anthropic" courses={anthropicList} onTap={handleTapCourse} />
            <PartnerSection partner="google" courses={googleList} onTap={handleTapCourse} />
          </>
        )}

        {/* Browse all + category filter */}
        <View style={ls.section}>
          <Text style={[ls.sectionTitle, { color: colors.foreground }]}>
            {search !== "" ? `Results for "${search}"` : "Browse All"}
          </Text>

          {/* Category pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    ls.categoryPill,
                    active ? { backgroundColor: colors.primary } : { backgroundColor: colors.secondary, borderColor: colors.border, borderWidth: 1 },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedCategory(cat);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={[ls.categoryPillText, { color: active ? "#fff" : colors.foreground }]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={{ marginTop: 12, gap: 2 }}>
            {filtered.length === 0 ? (
              <View style={ls.emptyState}>
                <Feather name="search" size={32} color={colors.mutedForeground} />
                <Text style={[ls.emptyText, { color: colors.mutedForeground }]}>No courses found</Text>
              </View>
            ) : (
              filtered.map((course) => (
                <TouchableOpacity key={course.id} onPress={() => handleTapCourse(course)} activeOpacity={0.95}>
                  <View style={{ position: "relative" }}>
                    <CourseCard course={course} onPress={() => handleTapCourse(course)} />
                    {/* Share icon on list cards */}
                    <TouchableOpacity
                      style={[ls.listShareBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        shareCourse(course);
                      }}
                      activeOpacity={0.8}
                    >
                      <Feather name="share-2" size={13} color={colors.mutedForeground} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Stylesheet: detail sheet ─────────────────────────────────────────────────
const ds = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.92,
    ...Platform.select({
      web: { boxShadow: "0px -4px 20px rgba(0,0,0,0.18)" } as any,
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
        elevation: 24,
      },
    }),
    overflow: "hidden",
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  heroThumb: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroOrb: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.15,
    top: -80,
    right: -60,
  },
  heroBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  heroActions: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    gap: 8,
  },
  heroActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroPartner: {
    position: "absolute",
    bottom: 12,
    left: 14,
  },
  sheetBody: {
    padding: 20,
    gap: 18,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  catPillText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  sheetInstructor: {
    fontSize: 14,
    marginTop: -8,
  },
  statsStrip: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 4,
  },
  rewardBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  rewardSub: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 21,
  },
  learnRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  learnDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  learnText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  moduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  moduleNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  moduleNumText: {
    fontSize: 12,
    fontWeight: "800",
  },
  moduleText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  shareGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  shareBtnLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  stickyCTA: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
  },
  shareOutlineBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  enrollCTA: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    borderRadius: 14,
  },
  enrollCTAText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});

// ─── Stylesheet: modals ───────────────────────────────────────────────────────
const ms = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 12,
    width: "100%",
    maxWidth: 340,
  },
  icon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", backgroundColor: "#F9EDE6" },
  title: { fontSize: 24, fontWeight: "800" },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  rewardRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, width: "100%" },
  rewardTitle: { fontSize: 16, fontWeight: "800" },
  rewardSub: { fontSize: 12, marginTop: 2 },
  btn: { width: "100%", paddingVertical: 16, borderRadius: 16, alignItems: "center", marginTop: 4 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  welcome: { borderRadius: 28, overflow: "hidden", width: "100%", maxWidth: 360 },
  welcomeHeader: { alignItems: "center", justifyContent: "center", paddingVertical: 32 },
  welcomeBody: { padding: 24, gap: 16 },
  welcomeTitle: { fontSize: 26, fontWeight: "800", textAlign: "center" },
  welcomeSub: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  bonusAmt: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, padding: 20, borderRadius: 18 },
  bonusNum: { fontSize: 40, fontWeight: "900" },
  bonusLabel: { fontSize: 18, fontWeight: "600" },
  perkRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  perkDot: { width: 6, height: 6, borderRadius: 3 },
  perkText: { fontSize: 14, lineHeight: 20, flex: 1 },
  claimBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 18, marginTop: 4 },
  claimText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});

// ─── Stylesheet: list screen ──────────────────────────────────────────────────
const ls = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, gap: 12 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  greeting: { fontSize: 13, marginBottom: 2 },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 24, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  seeAll: { fontSize: 13, fontWeight: "600" },
  categoryPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  categoryPillText: { fontSize: 13, fontWeight: "600" },
  partnerSection: { marginBottom: 24, gap: 12 },
  partnerSectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  partnerCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden", width: 240 },
  partnerCardThumb: { height: 110, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  partnerCardAccent: { position: "absolute", width: 180, height: 180, borderRadius: 90, top: -60, right: -40 },
  partnerCardBadge: { position: "absolute", bottom: 8, right: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  partnerCardBadgeText: { fontSize: 10, fontWeight: "700" },
  partnerCardBody: { padding: 12, gap: 3 },
  partnerCardCategory: { fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.4 },
  partnerCardTitle: { fontSize: 14, fontWeight: "700", lineHeight: 19 },
  partnerCardInstructor: { fontSize: 12 },
  partnerCardMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  partnerCardMetaText: { fontSize: 12 },
  partnerCardMetaDot: { fontSize: 12 },
  partnerCardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  enrolledBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  enrolledText: { fontSize: 12, fontWeight: "600" },
  rewardChip: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  rewardChipText: { fontSize: 12, fontWeight: "700" },
  shareRowBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  shareIconBtn: { width: 28, height: 28, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  enrollBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12 },
  enrollBtnText: { fontSize: 12, fontWeight: "700" },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 15, fontWeight: "600" },
  listShareBtn: {
    position: "absolute",
    bottom: 22,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─── Small-badge styles ───────────────────────────────────────────────────────
const sb = StyleSheet.create({
  partnerBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, alignSelf: "flex-start" },
  partnerIcon: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  partnerIconText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  partnerLabel: { fontSize: 13, fontWeight: "700" },
  coinBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  coinEmoji: { fontSize: 15 },
  coinCount: { fontSize: 15, fontWeight: "800" },
});
