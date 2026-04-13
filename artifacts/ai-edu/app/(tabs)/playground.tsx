import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";

const PROMPT_TEMPLATES = [
  {
    id: "t1",
    icon: "edit-3",
    label: "Chain of Thought",
    prompt: "Let's think step by step. [Your question here]",
    color: "#6C63FF",
  },
  {
    id: "t2",
    icon: "user",
    label: "Role Prompting",
    prompt: "You are an expert [role]. Help me [task].",
    color: "#2563EB",
  },
  {
    id: "t3",
    icon: "list",
    label: "Few-Shot",
    prompt: "Here are some examples:\nInput: [example 1]\nOutput: [result 1]\n\nNow do this: [your input]",
    color: "#10B981",
  },
  {
    id: "t4",
    icon: "target",
    label: "STAR Method",
    prompt: "Situation: [context]\nTask: [what needs to be done]\nAction: [steps to take]\nResult: [expected outcome]",
    color: "#F97316",
  },
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "What technique involves giving AI a few examples before the actual task?",
    options: ["Zero-shot prompting", "Few-shot prompting", "Chain-of-thought", "System prompting"],
    correct: 1,
    explanation: "Few-shot prompting provides example input/output pairs so the model understands the pattern before your actual request.",
  },
  {
    id: "q2",
    question: "Which prompting method asks the model to reason step by step?",
    options: ["Role prompting", "Temperature control", "Chain-of-thought prompting", "Few-shot prompting"],
    correct: 2,
    explanation: "Chain-of-thought (CoT) prompting encourages the model to break down its reasoning, improving accuracy on complex tasks.",
  },
  {
    id: "q3",
    question: "What does 'temperature' control in LLMs?",
    options: ["Processing speed", "Randomness/creativity of output", "Token limit", "Response length"],
    correct: 1,
    explanation: "Temperature controls output randomness. Low (0-0.3) = focused/deterministic. High (0.7-1.0) = creative/varied.",
  },
];

type Tab = "prompt" | "quiz";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function PlaygroundScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { playgroundSessions, updatePlaygroundSession } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("prompt");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to the AI Playground! I'm here to help you practice prompt engineering and explore AI concepts.\n\nTry one of the templates below, or ask me anything about AI.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const topPadding = Platform.OS === "web" ? 77 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const simulateAIResponse = async (userMsg: string): Promise<string> => {
    const lower = userMsg.toLowerCase();
    if (lower.includes("chain") && lower.includes("thought")) {
      return "Chain-of-thought (CoT) prompting is a technique where you ask the model to reason through a problem step by step before giving the final answer.\n\nExample:\n'Solve this math problem step by step: If a train travels 60mph for 2.5 hours, how far does it go?'\n\nThis produces more accurate results, especially for reasoning and math tasks. Try adding 'Let's think step by step' to complex prompts!";
    }
    if (lower.includes("few-shot") || lower.includes("few shot")) {
      return "Few-shot prompting means providing the model with 2-5 examples of the desired input/output format before your actual request.\n\nWhy it works: LLMs are great pattern matchers. Showing examples tells the model exactly what format and style you expect.\n\nTip: Use 3 diverse examples for best results — they should cover edge cases your real prompt might face.";
    }
    if (lower.includes("temperature")) {
      return "Temperature is a key parameter that controls how 'creative' or 'random' an AI's responses are:\n\n• 0.0 — Deterministic, always picks most likely token\n• 0.3 — Focused, good for factual tasks\n• 0.7 — Balanced creativity (default for most apps)\n• 1.0+ — Very creative, can be unpredictable\n\nFor coding tasks: use 0.1-0.3\nFor creative writing: use 0.7-0.9\nFor brainstorming: use 0.8-1.0";
    }
    if (lower.includes("rag")) {
      return "RAG (Retrieval-Augmented Generation) combines LLMs with external knowledge retrieval:\n\n1. User asks a question\n2. System searches a knowledge base for relevant documents\n3. Relevant docs are added to the prompt as context\n4. LLM generates a response grounded in that context\n\nRAG vs Fine-tuning:\n• RAG: Better for dynamic/updating knowledge\n• Fine-tuning: Better for style/behavior changes\n\nMost production AI apps use RAG for knowledge-intensive tasks.";
    }
    if (lower.includes("hello") || lower.includes("hi ") || lower.includes("hey")) {
      return "Hello! I'm your AI learning assistant. I can help you with:\n\n• Prompt engineering techniques\n• AI/ML concepts explained simply\n• Code examples using AI APIs\n• Understanding LLMs and transformers\n\nWhat would you like to explore today?";
    }
    return `That's a great question about "${userMsg.slice(0, 40)}${userMsg.length > 40 ? "..." : ""}"\n\nThis is a simulated AI response demonstrating the playground interface. In a full implementation, this would connect to a real LLM API like GPT-4 or Claude to give you accurate, contextual answers.\n\nTry asking about:\n• Chain-of-thought prompting\n• Few-shot examples\n• Temperature settings\n• RAG vs fine-tuning`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    const response = await simulateAIResponse(userMessage);
    setMessages([...newMessages, { role: "assistant", content: response }]);
    setIsLoading(false);
  };

  const useTemplate = (prompt: string) => {
    setInput(prompt);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (index === QUIZ_QUESTIONS[quizIndex].correct) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (quizIndex + 1 >= QUIZ_QUESTIONS.length) {
      setQuizDone(true);
    } else {
      setQuizIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizDone(false);
  };

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
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>AI Playground</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>Practice what you learn</Text>
        </View>
        <View style={[styles.tabRow, { backgroundColor: colors.secondary }]}>
          {(["prompt", "quiz"] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBtn,
                activeTab === tab && { backgroundColor: colors.primary },
              ]}
              onPress={() => {
                setActiveTab(tab);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab ? "#fff" : colors.mutedForeground },
                ]}
              >
                {tab === "prompt" ? "Chat" : "Quiz"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === "prompt" ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={[styles.chatContent, { paddingBottom: 16 }]}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.templates}
              >
                {PROMPT_TEMPLATES.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.templateChip, { backgroundColor: t.color + "15", borderColor: t.color + "30", borderWidth: 1 }]}
                    onPress={() => useTemplate(t.prompt)}
                    activeOpacity={0.85}
                  >
                    <Feather name={t.icon as any} size={13} color={t.color} />
                    <Text style={[styles.templateLabel, { color: t.color }]}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.role === "user"
                    ? [styles.userBubble, { backgroundColor: colors.primary }]
                    : [styles.aiBubble, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }],
                ]}
              >
                {item.role === "assistant" && (
                  <View style={[styles.aiLabel, { backgroundColor: colors.secondary }]}>
                    <Feather name="cpu" size={10} color={colors.primary} />
                    <Text style={[styles.aiLabelText, { color: colors.primary }]}>AI</Text>
                  </View>
                )}
                <Text style={[styles.messageText, { color: item.role === "user" ? "#fff" : colors.foreground }]}>
                  {item.content}
                </Text>
              </View>
            )}
            ListFooterComponent={
              isLoading ? (
                <View style={[styles.loadingBubble, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Thinking...</Text>
                </View>
              ) : null
            }
          />

          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: colors.background,
                borderTopColor: colors.border,
                paddingBottom: bottomPadding + 8,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              value={input}
              onChangeText={setInput}
              placeholder="Ask anything about AI..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                {
                  backgroundColor: input.trim() ? colors.primary : colors.secondary,
                  opacity: input.trim() ? 1 : 0.6,
                },
              ]}
              onPress={sendMessage}
              disabled={!input.trim() || isLoading}
              activeOpacity={0.85}
            >
              <Feather name="send" size={18} color={input.trim() ? "#fff" : colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.quizContent,
            { paddingBottom: bottomPadding + 80 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {quizDone ? (
            <View style={styles.quizDone}>
              <View style={[styles.scoreCircle, { backgroundColor: colors.primary + "15", borderColor: colors.primary }]}>
                <Text style={[styles.scoreNumber, { color: colors.primary }]}>{score}/{QUIZ_QUESTIONS.length}</Text>
                <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Score</Text>
              </View>
              <Text style={[styles.doneTitle, { color: colors.foreground }]}>
                {score === QUIZ_QUESTIONS.length ? "Perfect!" : score >= 2 ? "Well done!" : "Keep learning!"}
              </Text>
              <Text style={[styles.doneSubtitle, { color: colors.mutedForeground }]}>
                {score === QUIZ_QUESTIONS.length
                  ? "You aced the prompting fundamentals quiz."
                  : "Review the AI Playground chat for the concepts you missed."}
              </Text>
              <TouchableOpacity
                style={[styles.retryBtn, { backgroundColor: colors.primary }]}
                onPress={restartQuiz}
                activeOpacity={0.85}
              >
                <Feather name="refresh-cw" size={16} color="#fff" />
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.quizCard}>
              <View style={styles.quizProgress}>
                <Text style={[styles.quizCounter, { color: colors.mutedForeground }]}>
                  Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
                </Text>
                <View style={[styles.progressBar, { backgroundColor: colors.secondary }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` as any,
                      },
                    ]}
                  />
                </View>
              </View>

              <Text style={[styles.questionText, { color: colors.foreground }]}>
                {QUIZ_QUESTIONS[quizIndex].question}
              </Text>

              <View style={styles.options}>
                {QUIZ_QUESTIONS[quizIndex].options.map((option, idx) => {
                  const isCorrect = idx === QUIZ_QUESTIONS[quizIndex].correct;
                  const isSelected = idx === selectedAnswer;
                  let bg = colors.card;
                  let border = colors.border;
                  let textColor = colors.foreground;

                  if (showExplanation) {
                    if (isCorrect) {
                      bg = "#10B98115";
                      border = "#10B981";
                      textColor = "#10B981";
                    } else if (isSelected && !isCorrect) {
                      bg = "#EF444415";
                      border = "#EF4444";
                      textColor = "#EF4444";
                    }
                  } else if (isSelected) {
                    bg = colors.primary + "15";
                    border = colors.primary;
                    textColor = colors.primary;
                  }

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.option, { backgroundColor: bg, borderColor: border, borderWidth: 1.5 }]}
                      onPress={() => handleAnswer(idx)}
                      activeOpacity={0.85}
                    >
                      <View style={[styles.optionLetter, { backgroundColor: border + "25" }]}>
                        <Text style={[styles.optionLetterText, { color: textColor }]}>
                          {String.fromCharCode(65 + idx)}
                        </Text>
                      </View>
                      <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                      {showExplanation && isCorrect && (
                        <Ionicons name="checkmark-circle" size={18} color="#10B981" style={{ marginLeft: "auto" }} />
                      )}
                      {showExplanation && isSelected && !isCorrect && (
                        <Ionicons name="close-circle" size={18} color="#EF4444" style={{ marginLeft: "auto" }} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {showExplanation && (
                <View style={[styles.explanation, { backgroundColor: colors.accent, borderColor: colors.accentForeground + "30", borderWidth: 1 }]}>
                  <Feather name="info" size={14} color={colors.accentForeground} />
                  <Text style={[styles.explanationText, { color: colors.foreground }]}>
                    {QUIZ_QUESTIONS[quizIndex].explanation}
                  </Text>
                </View>
              )}

              {showExplanation && (
                <TouchableOpacity
                  style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                  onPress={nextQuestion}
                  activeOpacity={0.85}
                >
                  <Text style={styles.nextBtnText}>
                    {quizIndex + 1 < QUIZ_QUESTIONS.length ? "Next Question" : "See Results"}
                  </Text>
                  <Feather name="arrow-right" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerTitle: { fontSize: 22, fontWeight: "800" },
  headerSub: { fontSize: 13, marginTop: 2 },
  tabRow: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabText: { fontSize: 13, fontWeight: "700" },
  chatContent: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },
  templates: { gap: 8, paddingBottom: 8 },
  templateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  templateLabel: { fontSize: 12, fontWeight: "700" },
  messageBubble: { borderRadius: 16, padding: 14, maxWidth: "88%" },
  userBubble: { alignSelf: "flex-end" },
  aiBubble: { alignSelf: "flex-start" },
  aiLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  aiLabelText: { fontSize: 10, fontWeight: "700" },
  messageText: { fontSize: 14, lineHeight: 21 },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    borderRadius: 16,
    padding: 14,
  },
  loadingText: { fontSize: 13 },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    maxHeight: 120,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  quizContent: { paddingHorizontal: 16, paddingTop: 20 },
  quizCard: { gap: 20 },
  quizProgress: { gap: 8 },
  quizCounter: { fontSize: 13, fontWeight: "600" },
  progressBar: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  questionText: { fontSize: 18, fontWeight: "700", lineHeight: 26 },
  options: { gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
  },
  optionLetter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLetterText: { fontSize: 13, fontWeight: "700" },
  optionText: { flex: 1, fontSize: 14, lineHeight: 20 },
  explanation: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    alignItems: "flex-start",
  },
  explanationText: { flex: 1, fontSize: 13, lineHeight: 19 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 16,
  },
  nextBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  quizDone: { alignItems: "center", paddingTop: 40, gap: 16 },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    marginBottom: 8,
  },
  scoreNumber: { fontSize: 32, fontWeight: "800" },
  scoreLabel: { fontSize: 13 },
  doneTitle: { fontSize: 24, fontWeight: "800" },
  doneSubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20, paddingHorizontal: 20 },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  retryText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
