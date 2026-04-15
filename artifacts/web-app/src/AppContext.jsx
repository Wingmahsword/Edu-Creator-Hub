import React, { createContext, useContext, useState } from 'react';

const COURSES = [
  { id: 'course_ng_ml', title: 'Machine Learning Specialization', instructor: 'Andrew Ng', instructorAvatar: 'AN', partner: 'coursera', category: 'Machine Learning', level: 'Beginner', duration: '3 months', lessons: 92, progress: 0, rating: 4.9, students: 1200000, thumbnail: 'ml', description: 'The most popular ML course on earth. Andrew Ng teaches supervised learning, unsupervised learning, and best practices.', tags: ['Python', 'Supervised Learning', 'Neural Networks', 'TensorFlow'], rewardCoins: 150 },
  { id: 'course_ng_everyone', title: 'AI for Everyone', instructor: 'Andrew Ng', instructorAvatar: 'AN', partner: 'coursera', category: 'AI Fundamentals', level: 'Beginner', duration: '6 hours', lessons: 18, progress: 0, rating: 4.8, students: 890000, thumbnail: 'ethics', description: 'Non-technical course on what AI can and cannot do. Spot AI opportunities and understand societal impact.', tags: ['No Code', 'Strategy', 'Business AI'], rewardCoins: 75 },
  { id: 'course_dl_specialization', title: 'Deep Learning Specialization', instructor: 'Andrew Ng', instructorAvatar: 'AN', partner: 'coursera', category: 'Deep Learning', level: 'Intermediate', duration: '5 months', lessons: 120, progress: 0, rating: 4.9, students: 760000, thumbnail: 'dl', description: 'Build and train deep neural networks, CNNs, RNNs, and Transformers.', tags: ['TensorFlow', 'CNNs', 'RNNs', 'Transformers'], rewardCoins: 200 },
  { id: 'yt_karpathy_hero', title: 'Neural Networks: Zero to Hero', instructor: 'Andrej Karpathy', instructorAvatar: 'AK', partner: 'youtube', category: 'Deep Learning', level: 'Intermediate', duration: '20 hours', lessons: 7, progress: 0, rating: 5.0, students: 450000, thumbnail: 'dl', description: 'Build neural networks from scratch, including backprop, language models, and transformers.', tags: ['Python', 'PyTorch', 'Backprop', 'Transformers'], rewardCoins: 180 },
  { id: 'yt_stanford_cs229', title: 'CS229: Machine Learning', instructor: 'Stanford University', instructorAvatar: 'SU', partner: 'youtube', category: 'Machine Learning', level: 'Intermediate', duration: '40 hours', lessons: 20, progress: 0, rating: 4.9, students: 980000, thumbnail: 'ml', description: "Stanford's legendary ML course covering theory, algorithms, and applications.", tags: ['Math', 'Regression', 'SVM'], rewardCoins: 200 },
  { id: 'yt_huggingface_nlp', title: 'NLP Course', instructor: 'Hugging Face Team', instructorAvatar: 'HF', partner: 'youtube', category: 'Generative AI', level: 'Intermediate', duration: '12 hours', lessons: 25, progress: 0, rating: 4.8, students: 230000, thumbnail: 'llm', description: 'Transformers, tokenization, fine-tuning, and semantic search from the creators.', tags: ['Transformers', 'BERT', 'Fine-tuning'], rewardCoins: 120 },
  { id: 'yt_llmops', title: 'LLMOps: Real-World Apps', instructor: 'Comet ML', instructorAvatar: 'CM', partner: 'youtube', category: 'AI Applications', level: 'Advanced', duration: '15 hours', lessons: 12, progress: 0, rating: 4.7, students: 56000, thumbnail: 'apps', description: 'Build modern software with LLMs. Covers evaluation, monitoring, and deployment.', tags: ['LLMOps', 'LangChain', 'Production'], rewardCoins: 150 },
  { id: 'course_anthropic_prompting', title: 'Prompt Engineering for Claude', instructor: 'Anthropic Team', instructorAvatar: 'AT', partner: 'anthropic', category: 'Prompt Engineering', level: 'Beginner', duration: '4 hours', lessons: 22, progress: 0, rating: 4.9, students: 340000, thumbnail: 'prompt', description: 'Official Anthropic course on getting the best from Claude.', tags: ['Claude', 'Chain-of-Thought', 'Safety'], rewardCoins: 100 },
  { id: 'course_anthropic_safety', title: 'AI Safety & Constitutional AI', instructor: 'Anthropic Research', instructorAvatar: 'AR', partner: 'anthropic', category: 'AI Ethics', level: 'Intermediate', duration: '6 hours', lessons: 28, progress: 0, rating: 4.8, students: 180000, thumbnail: 'ethics', description: 'How Constitutional AI works and how Anthropic trains safe AI.', tags: ['Safety', 'RLHF', 'Constitutional AI'], rewardCoins: 120 },
  { id: 'course_google_mlcc', title: 'Machine Learning Crash Course', instructor: 'Google AI Team', instructorAvatar: 'GA', partner: 'google', category: 'Machine Learning', level: 'Beginner', duration: '15 hours', lessons: 40, progress: 0, rating: 4.7, students: 2100000, thumbnail: 'ml', description: "Google's fast-paced, practical introduction to ML.", tags: ['TensorFlow', 'Google', 'Classification'], rewardCoins: 100 },
  { id: 'course_google_genai', title: 'Generative AI Learning Path', instructor: 'Google Cloud', instructorAvatar: 'GC', partner: 'google', category: 'Generative AI', level: 'Beginner', duration: '8 hours', lessons: 30, progress: 25, rating: 4.8, students: 650000, thumbnail: 'llm', description: 'LLMs, image generation, and generative AI applications on Google Cloud.', tags: ['Vertex AI', 'Gemini', 'LLMs'], rewardCoins: 125 },
  { id: 'course_google_gemini', title: 'Building with Gemini API', instructor: 'Google DeepMind', instructorAvatar: 'GD', partner: 'google', category: 'AI Applications', level: 'Intermediate', duration: '10 hours', lessons: 36, progress: 0, rating: 4.7, students: 320000, thumbnail: 'apps', description: 'Build production apps using Gemini API. Covers multimodal inputs and deployment.', tags: ['Gemini API', 'Python', 'Multimodal'], rewardCoins: 130 },
  { id: 'course_mastering_prompts', title: 'Mastering Prompt Engineering', instructor: 'Marcus Rivera', instructorAvatar: 'MR', partner: 'internal', category: 'Prompt Engineering', level: 'Beginner', duration: '4h 30m', lessons: 24, progress: 0, rating: 4.9, students: 34500, thumbnail: 'prompt', description: 'Learn to craft precise, effective prompts for any AI system.', tags: ['ChatGPT', 'Claude', 'AI Writing'], rewardCoins: 80 },
];

const REELS = [
  { id: 'r1', creator: 'Sarah Chen', creatorHandle: '@sarahchen_ai', creatorAvatar: 'SC', title: '5 prompts that changed how I use ChatGPT', description: 'These prompt techniques took my AI interactions from basic to professional #promptengineering #ai', likes: 18400, comments: 892, shares: 2100, duration: '0:58', tags: ['#prompts', '#chatgpt', '#ai'] },
  { id: 'r2', creator: 'Marcus Rivera', creatorHandle: '@marcus_prompts', creatorAvatar: 'MR', title: 'Chain-of-thought prompting explained in 60 seconds', description: 'The technique that makes AI actually think step by step.', likes: 24100, comments: 1203, shares: 3400, duration: '1:02', tags: ['#chainofthought', '#prompting'] },
  { id: 'r3', creator: 'Aiko Tanaka', creatorHandle: '@aiko_deeplearning', creatorAvatar: 'AT', title: 'How attention mechanisms actually work', description: 'Visualizing the transformer\'s core building block.', likes: 31200, comments: 1567, shares: 4800, duration: '1:15', tags: ['#attention', '#transformers'] },
  { id: 'r4', creator: 'Dev Patel', creatorHandle: '@devpatel_builds', creatorAvatar: 'DP', title: 'I built an AI app in 30 minutes. Here\'s how', description: 'Using OpenAI API + React to build something real.', likes: 42800, comments: 2341, shares: 6700, duration: '0:47', tags: ['#openai', '#react', '#buildinpublic'] },
  { id: 'r5', creator: 'Sarah Chen', creatorHandle: '@sarahchen_ai', creatorAvatar: 'SC', title: 'RAG vs Fine-tuning: Which should you use?', description: 'Breaking down the key differences for production AI.', likes: 28700, comments: 1893, shares: 5200, duration: '1:30', tags: ['#rag', '#finetuning', '#llm'] },
];

const CREATORS = [
  { id: 'c1', name: 'Sarah Chen', handle: '@sarahchen_ai', avatar: 'SC', bio: 'AI researcher & educator. Making ML accessible to everyone.', followers: 142000, courses: 8, reels: 234, verified: true, specialty: 'Machine Learning' },
  { id: 'c2', name: 'Marcus Rivera', handle: '@marcus_prompts', avatar: 'MR', bio: 'Prompt engineer at leading AI lab.', followers: 89000, courses: 5, reels: 187, verified: true, specialty: 'Prompt Engineering' },
  { id: 'c3', name: 'Aiko Tanaka', handle: '@aiko_deeplearning', avatar: 'AT', bio: 'Deep learning specialist. PhD in Neural Networks.', followers: 67000, courses: 12, reels: 156, verified: true, specialty: 'Deep Learning' },
  { id: 'c4', name: 'Dev Patel', handle: '@devpatel_builds', avatar: 'DP', bio: 'Building AI products. Sharing what I learn along the way.', followers: 54000, courses: 6, reels: 203, verified: false, specialty: 'AI Applications' },
];

const AI_RESPONSES = [
  "That's a great question! In machine learning, **gradient descent** is an optimization algorithm used to minimize the loss function by iteratively moving in the direction of steepest descent. 📉\n\nThe learning rate controls how big each step is — too large and you overshoot, too small and training takes forever.",
  "**Transformers** revolutionized NLP! The key innovation is the **attention mechanism**, which allows the model to weigh the importance of different words in the input when generating each output token. Unlike RNNs, transformers process all tokens in parallel. ⚡",
  "For **prompt engineering**, here are 5 power techniques:\n1. **Role prompting** — Tell the AI to act as an expert\n2. **Chain-of-thought** — Ask it to think step by step\n3. **Few-shot examples** — Show 2-3 examples before your ask\n4. **Temperature control** — Lower for precision, higher for creativity\n5. **Structured output** — Ask for JSON or bullet points",
  "**RAG (Retrieval-Augmented Generation)** vs **Fine-tuning**:\n\n• RAG is great when you need up-to-date info or domain knowledge without retraining\n• Fine-tuning is better when you need specific tone, style, or task behavior baked in\n\nFor most production apps, start with RAG — it's faster and cheaper! 🚀",
  "Great question about **neural network layers**! Each layer learns increasingly abstract representations:\n- Early layers: edges, textures\n- Mid layers: shapes, patterns  \n- Deep layers: complex concepts, objects\n\nThis hierarchical feature learning is why deep networks are so powerful for vision tasks! 🧠",
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [enrolledCourses, setEnrolledCourses] = useState(['course_google_genai']);
  const [likedReels, setLikedReels] = useState(['r2']);
  const [savedReels, setSavedReels] = useState(['r3']);
  const [followingCreators, setFollowingCreators] = useState(['c2']);
  const [coins, setCoins] = useState(100);
  const [hasClaimedWelcome, setHasClaimedWelcome] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your AI learning assistant 🤖 Ask me anything about machine learning, prompt engineering, deep learning, or any AI topic. I'm here to help you learn!" }
  ]);
  const [courseFilter, setCourseFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const addToast = (text, icon = '✅') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, icon }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const claimWelcomeBonus = () => {
    setCoins(c => c + 100);
    setHasClaimedWelcome(true);
    addToast('+100 coins! Welcome bonus claimed! 🎉', '🪙');
  };

  const toggleLike = (id) => {
    setLikedReels(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleSave = (id) => {
    setSavedReels(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleFollow = (id) => {
    setFollowingCreators(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const enrollCourse = (courseId) => {
    if (enrolledCourses.includes(courseId)) return { coinsEarned: 0 };
    const course = COURSES.find(c => c.id === courseId);
    const reward = course?.rewardCoins ?? 50;
    setEnrolledCourses(prev => [...prev, courseId]);
    setCoins(c => c + reward);
    addToast(`+${reward} coins earned for enrolling in "${course?.title}"!`, '🪙');
    return { coinsEarned: reward };
  };
  const sendMessage = async (text) => {
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg, { role: 'thinking' }]);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const reply = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
    setMessages(prev => [...prev.filter(m => m.role !== 'thinking'), { role: 'assistant', content: reply }]);
  };

  const courses = COURSES.map(c => ({ ...c, enrolled: enrolledCourses.includes(c.id) }));
  const reels = REELS.map(r => ({ ...r, liked: likedReels.includes(r.id), saved: savedReels.includes(r.id) }));
  const creators = CREATORS.map(c => ({ ...c, following: followingCreators.includes(c.id) }));

  return (
    <AppContext.Provider value={{
      courses, reels, creators, coins, hasClaimedWelcome, messages, toasts,
      courseFilter, setCourseFilter, searchQuery, setSearchQuery,
      claimWelcomeBonus, toggleLike, toggleSave, toggleFollow, enrollCourse, sendMessage,
      enrolledCourses, likedReels, savedReels, followingCreators
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
