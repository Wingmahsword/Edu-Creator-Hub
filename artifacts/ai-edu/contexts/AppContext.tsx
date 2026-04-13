import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  toggleLike: (reelId: string) => void;
  toggleSave: (reelId: string) => void;
  toggleFollow: (creatorId: string) => void;
  enrollCourse: (courseId: string) => void;
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
  {
    id: "course1",
    title: "Mastering Prompt Engineering",
    instructor: "Marcus Rivera",
    instructorAvatar: "MR",
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
  },
  {
    id: "course2",
    title: "Machine Learning Fundamentals",
    instructor: "Sarah Chen",
    instructorAvatar: "SC",
    category: "Machine Learning",
    level: "Intermediate",
    duration: "12h 15m",
    lessons: 48,
    enrolled: true,
    progress: 35,
    rating: 4.8,
    students: 28900,
    thumbnail: "ml",
    description: "Comprehensive introduction to ML concepts. Supervised, unsupervised, and reinforcement learning explained clearly.",
    tags: ["Python", "TensorFlow", "Scikit-learn", "Data Science"],
  },
  {
    id: "course3",
    title: "Neural Networks & Deep Learning",
    instructor: "Aiko Tanaka",
    instructorAvatar: "AT",
    category: "Deep Learning",
    level: "Advanced",
    duration: "18h 45m",
    lessons: 62,
    enrolled: false,
    progress: 0,
    rating: 4.9,
    students: 19200,
    thumbnail: "dl",
    description: "Dive deep into neural network architecture. Build transformers, CNNs, and RNNs from scratch.",
    tags: ["PyTorch", "Transformers", "CNNs", "Research"],
  },
  {
    id: "course4",
    title: "Building AI-Powered Apps",
    instructor: "Dev Patel",
    instructorAvatar: "DP",
    category: "AI Applications",
    level: "Intermediate",
    duration: "8h 20m",
    lessons: 32,
    enrolled: false,
    progress: 0,
    rating: 4.7,
    students: 22100,
    thumbnail: "apps",
    description: "Turn AI APIs into real products. Build chatbots, image generators, and intelligent tools.",
    tags: ["OpenAI API", "React", "Node.js", "Product"],
  },
  {
    id: "course5",
    title: "AI Ethics & Safety",
    instructor: "Sarah Chen",
    instructorAvatar: "SC",
    category: "AI Ethics",
    level: "Beginner",
    duration: "3h 10m",
    lessons: 18,
    enrolled: false,
    progress: 0,
    rating: 4.6,
    students: 15800,
    thumbnail: "ethics",
    description: "Understand bias, fairness, and responsible AI development. A must for every AI practitioner.",
    tags: ["Ethics", "Bias", "Safety", "Policy"],
  },
  {
    id: "course6",
    title: "Large Language Models Explained",
    instructor: "Aiko Tanaka",
    instructorAvatar: "AT",
    category: "Machine Learning",
    level: "Intermediate",
    duration: "6h 45m",
    lessons: 28,
    enrolled: false,
    progress: 0,
    rating: 4.8,
    students: 31200,
    thumbnail: "llm",
    description: "How GPT, BERT, and modern LLMs actually work. Architecture, training, and fine-tuning demystified.",
    tags: ["LLMs", "GPT", "BERT", "Transformers"],
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
    duration: "1:30",
    tags: ["#rag", "#finetuning", "#llm"],
    liked: false,
    saved: false,
    thumbnail: "r5",
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(["course2"]);
  const [savedReels, setSavedReels] = useState<string[]>(["r3"]);
  const [likedReels, setLikedReels] = useState<string[]>(["r2"]);
  const [followingCreators, setFollowingCreators] = useState<string[]>(["c2"]);
  const [playgroundSessions, setPlaygroundSessions] = useState<PlaygroundSession[]>([
    {
      id: "ps1",
      name: "Prompt Sandbox",
      type: "prompt",
      createdAt: new Date().toISOString(),
      messages: [],
    },
  ]);

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

  const enrollCourse = (courseId: string) => {
    setEnrolledCourses((prev) =>
      prev.includes(courseId) ? prev : [...prev, courseId]
    );
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
