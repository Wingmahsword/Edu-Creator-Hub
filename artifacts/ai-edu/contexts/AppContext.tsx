import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  partner: "coursera" | "anthropic" | "google" | "internal" | "youtube";
  partnerLogo: string;
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
  rewardCoins: number;
}

interface Reel {
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

interface PlaygroundSession {
  id: string;
  name: string;
  type: "prompt" | "code" | "quiz";
  createdAt: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}

interface AppState {
  courses: Course[];
  reels: Reel[];
  creators: Creator[];
  playgroundSessions: PlaygroundSession[];
  enrolledCourses: string[];
  savedReels: string[];
  likedReels: string[];
  followingCreators: string[];
  coins: number;
  hasClaimedWelcomeBonus: boolean;
  claimWelcomeBonus: () => void;
  toggleLike: (reelId: string) => void;
  toggleSave: (reelId: string) => void;
  toggleFollow: (creatorId: string) => void;
  enrollCourse: (courseId: string) => { coinsEarned: number };
  addPlaygroundSession: (session: PlaygroundSession) => void;
  updatePlaygroundSession: (id: string, messages: Array<{ role: "user" | "assistant"; content: string }>) => void;
}

const AppContext = createContext<AppState | null>(null);

const CREATORS: Creator[] = [
  {
    id: "c1",
    name: "Sarah Chen",
    handle: "@sarahchen_ai",
    avatar: "SC",
    bio: "AI researcher & educator. Making ML accessible to everyone.",
    followers: 142000,
    courses: 8,
    reels: 234,
    following: false,
    verified: true,
    specialty: "Machine Learning",
  },
  {
    id: "c2",
    name: "Marcus Rivera",
    handle: "@marcus_prompts",
    avatar: "MR",
    bio: "Prompt engineer at leading AI lab. Teaching the art of AI communication.",
    followers: 89000,
    courses: 5,
    reels: 187,
    following: true,
    verified: true,
    specialty: "Prompt Engineering",
  },
  {
    id: "c3",
    name: "Aiko Tanaka",
    handle: "@aiko_deeplearning",
    avatar: "AT",
    bio: "Deep learning specialist. PhD in Neural Networks.",
    followers: 67000,
    courses: 12,
    reels: 156,
    following: false,
    verified: true,
    specialty: "Deep Learning",
  },
  {
    id: "c4",
    name: "Dev Patel",
    handle: "@devpatel_builds",
    avatar: "DP",
    bio: "Building AI products. Sharing what I learn along the way.",
    followers: 54000,
    courses: 6,
    reels: 203,
    following: false,
    verified: false,
    specialty: "AI Applications",
  },
];

const COURSES: Course[] = [
  // --- Partner: Coursera ---
  {
    id: "course_ng_ml",
    title: "Machine Learning Specialization",
    instructor: "Andrew Ng",
    instructorAvatar: "AN",
    partner: "coursera",
    partnerLogo: "coursera",
    category: "Machine Learning",
    level: "Beginner",
    duration: "3 months",
    lessons: 92,
    enrolled: false,
    progress: 0,
    rating: 4.9,
    students: 1200000,
    thumbnail: "ml",
    description: "The most popular ML course on earth. Andrew Ng teaches supervised learning, unsupervised learning, and best practices in machine learning.",
    tags: ["Python", "Supervised Learning", "Neural Networks", "TensorFlow"],
    rewardCoins: 150,
  },
  {
    id: "course_ng_everyone",
    title: "AI for Everyone",
    instructor: "Andrew Ng",
    instructorAvatar: "AN",
    partner: "coursera",
    partnerLogo: "coursera",
    category: "AI Fundamentals",
    level: "Beginner",
    duration: "6 hours",
    lessons: 18,
    enrolled: false,
    progress: 0,
    rating: 4.8,
    students: 890000,
    thumbnail: "ethics",
    description: "Non-technical course on what AI can and cannot do. Learn to spot AI opportunities and understand the societal impact.",
    tags: ["No Code", "Strategy", "Business AI", "Fundamentals"],
    rewardCoins: 75,
  },
  {
    id: "course_dl_specialization",
    title: "Deep Learning Specialization",
    instructor: "Andrew Ng",
    instructorAvatar: "AN",
    partner: "coursera",
    partnerLogo: "coursera",
    category: "Deep Learning",
    level: "Intermediate",
    duration: "5 months",
    lessons: 120,
    enrolled: false,
    progress: 0,
    rating: 4.9,
    students: 760000,
    thumbnail: "dl",
    description: "Build and train deep neural networks, CNNs, RNNs, and Transformers. The gold standard deep learning curriculum.",
    tags: ["TensorFlow", "CNNs", "RNNs", "Transformers"],
    rewardCoins: 200,
  },
  // --- Partner: YouTube (from dair-ai/ML-YouTube-Courses) ---
  {
    id: "yt_karpathy_hero",
    title: "Neural Networks: Zero to Hero",
    instructor: "Andrej Karpathy",
    instructorAvatar: "AK",
    partner: "youtube",
    partnerLogo: "youtube",
    category: "Deep Learning",
    level: "Intermediate",
    duration: "20 hours",
    lessons: 7,
    enrolled: false,
    progress: 0,
    rating: 5.0,
    students: 450000,
    thumbnail: "dl",
    description: "A series of lectures where Andrej Karpathy (former Tesla AI) builds neural networks from scratch, including backprop, language models, and transformers.",
    tags: ["Python", "PyTorch", "Backprop", "Transformers"],
    rewardCoins: 180,
  },
  {
    id: "yt_stanford_cs229",
    title: "CS229: Machine Learning",
    instructor: "Stanford University",
    instructorAvatar: "SU",
    partner: "youtube",
    partnerLogo: "youtube",
    category: "Machine Learning",
    level: "Intermediate",
    duration: "40 hours",
    lessons: 20,
    enrolled: false,
    progress: 0,
    rating: 4.9,
    students: 980000,
    thumbnail: "ml",
    description: "Stanford's legendary machine learning course covering the basic theory, algorithms, and applications of ML.",
    tags: ["Math", "Linear Algebra", "Regression", "SVM"],
    rewardCoins: 200,
  },
  {
    id: "yt_huggingface_nlp",
    title: "NLP Course",
    instructor: "Hugging Face Team",
    instructorAvatar: "HF",
    partner: "youtube",
    partnerLogo: "youtube",
    category: "Generative AI",
    level: "Intermediate",
    duration: "12 hours",
    lessons: 25,
    enrolled: false,
    progress: 0,
    rating: 4.8,
    students: 230000,
    thumbnail: "llm",
    description: "Learn about Transformers, tokenization, fine-tuning, and semantic search directly from the creators of the Transformers library.",
    tags: ["Transformers", "BERT", "Fine-tuning", "Semantic Search"],
    rewardCoins: 120,
  },
  {
    id: "yt_llmops",
    title: "LLMOps: Real-World Apps",
    instructor: "Comet ML",
    instructorAvatar: "CM",
    partner: "youtube",
    partnerLogo: "youtube",
    category: "AI Applications",
    level: "Advanced",
    duration: "15 hours",
    lessons: 12,
    enrolled: false,
    progress: 0,
    rating: 4.7,
    students: 56000,
    thumbnail: "apps",
    description: "Build modern software with LLMs using the newest tools and techniques in the field. Covers evaluation, monitoring, and deployment.",
    tags: ["LLMOps", "LangChain", "Monitoring", "Production"],
    rewardCoins: 150,
  },
  // --- Partner: Anthropic ---
  {
    id: "course_anthropic_prompting",
    title: "Prompt Engineering for Claude",
    instructor: "Anthropic Team",
    instructorAvatar: "AT",
    partner: "anthropic",
    partnerLogo: "anthropic",
    category: "Prompt Engineering",
    level: "Beginner",
    duration: "4 hours",
    lessons: 22,
    enrolled: false,
    progress: 0,
    rating: 4.9,
    students: 340000,
    thumbnail: "prompt",
    description: "Official Anthropic course on getting the best from Claude. Learn chain-of-thought, role prompting, and advanced reasoning techniques.",
    tags: ["Claude", "Chain-of-Thought", "Constitutional AI", "Safety"],
    rewardCoins: 100,
  },
  {
    id: "course_anthropic_safety",
    title: "AI Safety & Constitutional AI",
    instructor: "Anthropic Research",
    instructorAvatar: "AR",
    partner: "anthropic",
    partnerLogo: "anthropic",
    category: "AI Ethics",
    level: "Intermediate",
    duration: "6 hours",
    lessons: 28,
    enrolled: false,
    progress: 0,
    rating: 4.8,
    students: 180000,
    thumbnail: "ethics",
    description: "Learn how Constitutional AI works and how Anthropic trains safe AI. Covers RLHF, harmlessness, and responsible AI development.",
    tags: ["Safety", "RLHF", "Constitutional AI", "Alignment"],
    rewardCoins: 120,
  },
  // --- Partner: Google ---
  {
    id: "course_google_mlcc",
    title: "Machine Learning Crash Course",
    instructor: "Google AI Team",
    instructorAvatar: "GA",
    partner: "google",
    partnerLogo: "google",
    category: "Machine Learning",
    level: "Beginner",
    duration: "15 hours",
    lessons: 40,
    enrolled: false,
    progress: 0,
    rating: 4.7,
    students: 2100000,
    thumbnail: "ml",
    description: "Google's fast-paced, practical introduction to machine learning. Uses TensorFlow and real Google datasets.",
    tags: ["TensorFlow", "Google", "Regression", "Classification"],
    rewardCoins: 100,
  },
  {
    id: "course_google_genai",
    title: "Generative AI Learning Path",
    instructor: "Google Cloud",
    instructorAvatar: "GC",
    partner: "google",
    partnerLogo: "google",
    category: "Generative AI",
    level: "Beginner",
    duration: "8 hours",
    lessons: 30,
    enrolled: true,
    progress: 25,
    rating: 4.8,
    students: 650000,
    thumbnail: "llm",
    description: "A comprehensive path covering LLMs, image generation, and generative AI applications on Google Cloud.",
    tags: ["Vertex AI", "Gemini", "LLMs", "Cloud"],
    rewardCoins: 125,
  },
  {
    id: "course_google_gemini",
    title: "Building with Gemini API",
    instructor: "Google DeepMind",
    instructorAvatar: "GD",
    partner: "google",
    partnerLogo: "google",
    category: "AI Applications",
    level: "Intermediate",
    duration: "10 hours",
    lessons: 36,
    enrolled: false,
    progress: 0,
    rating: 4.7,
    students: 320000,
    thumbnail: "apps",
    description: "Build production apps using Google's Gemini API. Covers multimodal inputs, grounding, and real-world deployment.",
    tags: ["Gemini API", "Python", "Multimodal", "Production"],
    rewardCoins: 130,
  },
  // --- Internal ---
  {
    id: "course_mastering_prompts",
    title: "Mastering Prompt Engineering",
    instructor: "Marcus Rivera",
    instructorAvatar: "MR",
    partner: "internal",
    partnerLogo: "internal",
    category: "Prompt Engineering",
    level: "Beginner",
    duration: "4h 30m",
    lessons: 24,
    enrolled: false,
    progress: 0,
    rating: 4.9,
    students: 34500,
    thumbnail: "prompt",
    description: "Learn to craft precise, effective prompts for any AI system. From ChatGPT to Claude — master the language of AI.",
    tags: ["ChatGPT", "Claude", "Prompts", "AI Writing"],
    rewardCoins: 80,
  },
];

const REELS: Reel[] = [
  {
    id: "r1",
    creator: "Sarah Chen",
    creatorHandle: "@sarahchen_ai",
    creatorAvatar: "SC",
    title: "5 prompts that changed how I use ChatGPT",
    description: "These prompt techniques took my AI interactions from basic to professional #promptengineering #ai #chatgpt",
    likes: 18400,
    comments: 892,
    shares: 2100,
    durationSeconds: 58,
    duration: "0:58",
    tags: ["#prompts", "#chatgpt", "#ai"],
    liked: false,
    saved: false,
    thumbnail: "r1",
  },
  {
    id: "r2",
    creator: "Marcus Rivera",
    creatorHandle: "@marcus_prompts",
    creatorAvatar: "MR",
    title: "Chain-of-thought prompting explained in 60 seconds",
    description: "The technique that makes AI actually think step by step. Simple but powerful #machinelearning #prompts",
    likes: 24100,
    comments: 1203,
    shares: 3400,
    durationSeconds: 62,
    duration: "1:02",
    tags: ["#chainofthought", "#prompting", "#ml"],
    liked: true,
    saved: false,
    thumbnail: "r2",
  },
  {
    id: "r3",
    creator: "Aiko Tanaka",
    creatorHandle: "@aiko_deeplearning",
    creatorAvatar: "AT",
    title: "How attention mechanisms actually work",
    description: "Visualizing the transformer's core building block. Finally makes sense! #deeplearning #transformers",
    likes: 31200,
    comments: 1567,
    shares: 4800,
    durationSeconds: 75,
    duration: "1:15",
    tags: ["#attention", "#transformers", "#deeplearning"],
    liked: false,
    saved: true,
    thumbnail: "r3",
  },
  {
    id: "r4",
    creator: "Dev Patel",
    creatorHandle: "@devpatel_builds",
    creatorAvatar: "DP",
    title: "I built an AI app in 30 minutes. Here's how",
    description: "Using OpenAI API + React to build something real. Full walkthrough #aiapps #buildinpublic",
    likes: 42800,
    comments: 2341,
    shares: 6700,
    durationSeconds: 47,
    duration: "0:47",
    tags: ["#openai", "#react", "#buildinpublic"],
    liked: false,
    saved: false,
    thumbnail: "r4",
  },
  {
    id: "r5",
    creator: "Sarah Chen",
    creatorHandle: "@sarahchen_ai",
    creatorAvatar: "SC",
    title: "RAG vs Fine-tuning: Which should you use?",
    description: "Breaking down the key differences and when to use each approach for production AI #rag #finetuning",
    likes: 28700,
    comments: 1893,
    shares: 5200,
    durationSeconds: 90,
    duration: "1:30",
    tags: ["#rag", "#finetuning", "#llm"],
    liked: false,
    saved: false,
    thumbnail: "r5",
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(["course_google_genai"]);
  const [savedReels, setSavedReels] = useState<string[]>(["r3"]);
  const [likedReels, setLikedReels] = useState<string[]>(["r2"]);
  const [followingCreators, setFollowingCreators] = useState<string[]>(["c2"]);
  const [coins, setCoins] = useState(100);
  const [hasClaimedWelcomeBonus, setHasClaimedWelcomeBonus] = useState(false);
  const [playgroundSessions, setPlaygroundSessions] = useState<PlaygroundSession[]>([
    {
      id: "ps1",
      name: "Prompt Sandbox",
      type: "prompt",
      createdAt: new Date().toISOString(),
      messages: [],
    },
  ]);

  useEffect(() => {
    AsyncStorage.getItem("coins").then((val) => {
      if (val !== null) setCoins(parseInt(val, 10));
    });
    AsyncStorage.getItem("welcomeClaimed").then((val) => {
      if (val === "true") setHasClaimedWelcomeBonus(true);
    });
    AsyncStorage.getItem("enrolledCourses").then((val) => {
      if (val) setEnrolledCourses(JSON.parse(val));
    });
  }, []);

  const saveCoins = (amount: number) => {
    setCoins(amount);
    AsyncStorage.setItem("coins", amount.toString());
  };

  const claimWelcomeBonus = () => {
    const newCoins = coins + 100;
    saveCoins(newCoins);
    setHasClaimedWelcomeBonus(true);
    AsyncStorage.setItem("welcomeClaimed", "true");
  };

  const toggleLike = (reelId: string) => {
    setLikedReels((prev) =>
      prev.includes(reelId) ? prev.filter((id) => id !== reelId) : [...prev, reelId]
    );
  };

  const toggleSave = (reelId: string) => {
    setSavedReels((prev) =>
      prev.includes(reelId) ? prev.filter((id) => id !== reelId) : [...prev, reelId]
    );
  };

  const toggleFollow = (creatorId: string) => {
    setFollowingCreators((prev) =>
      prev.includes(creatorId) ? prev.filter((id) => id !== creatorId) : [...prev, creatorId]
    );
  };

  const enrollCourse = (courseId: string): { coinsEarned: number } => {
    if (enrolledCourses.includes(courseId)) return { coinsEarned: 0 };
    const course = COURSES.find((c) => c.id === courseId);
    const reward = course?.rewardCoins ?? 50;
    const newEnrolled = [...enrolledCourses, courseId];
    setEnrolledCourses(newEnrolled);
    AsyncStorage.setItem("enrolledCourses", JSON.stringify(newEnrolled));
    const newCoins = coins + reward;
    saveCoins(newCoins);
    return { coinsEarned: reward };
  };

  const addPlaygroundSession = (session: PlaygroundSession) => {
    setPlaygroundSessions((prev) => [...prev, session]);
  };

  const updatePlaygroundSession = (
    id: string,
    messages: Array<{ role: "user" | "assistant"; content: string }>
  ) => {
    setPlaygroundSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, messages } : s))
    );
  };

  const reelsWithState = REELS.map((reel) => ({
    ...reel,
    liked: likedReels.includes(reel.id),
    saved: savedReels.includes(reel.id),
  }));

  const coursesWithState = COURSES.map((course) => ({
    ...course,
    enrolled: enrolledCourses.includes(course.id),
  }));

  const creatorsWithState = CREATORS.map((creator) => ({
    ...creator,
    following: followingCreators.includes(creator.id),
  }));

  return (
    <AppContext.Provider
      value={{
        courses: coursesWithState,
        reels: reelsWithState,
        creators: creatorsWithState,
        playgroundSessions,
        enrolledCourses,
        savedReels,
        likedReels,
        followingCreators,
        coins,
        hasClaimedWelcomeBonus,
        claimWelcomeBonus,
        toggleLike,
        toggleSave,
        toggleFollow,
        enrollCourse,
        addPlaygroundSession,
        updatePlaygroundSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
