import React from 'react';
import { 
  Play, 
  Star, 
  Users, 
  Clock, 
  Search, 
  ChevronRight, 
  Layout, 
  Award,
  Youtube
} from 'lucide-react';

const COURSES = [
  {
    id: "yt_karpathy_hero",
    title: "Neural Networks: Zero to Hero",
    instructor: "Andrej Karpathy",
    category: "Deep Learning",
    students: "450k",
    rating: 5.0,
    duration: "20h",
    reward: 180,
    thumbnail: "from-blue-600 to-indigo-700",
  },
  {
    id: "yt_stanford_cs229",
    title: "CS229: Machine Learning",
    instructor: "Stanford University",
    category: "Machine Learning",
    students: "980k",
    rating: 4.9,
    duration: "40h",
    reward: 200,
    thumbnail: "from-red-700 to-red-900",
  },
  {
    id: "yt_huggingface_nlp",
    title: "NLP Course",
    instructor: "Hugging Face Team",
    category: "Generative AI",
    students: "230k",
    rating: 4.8,
    duration: "12h",
    reward: 120,
    thumbnail: "from-yellow-400 to-orange-500",
  }
];

export function CoursesPreview() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white border-b border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Learning Path</p>
            <h1 className="text-3xl font-black text-slate-900">Courses</h1>
          </div>
          <div className="bg-amber-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-amber-100">
            <Award className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-amber-700">1,240</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search AI courses, instructors..." 
            className="w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-slate-200 transition-all outline-none"
          />
        </div>
      </header>

      <main className="pb-24">
        {/* YouTube Academy Section */}
        <section className="mt-8">
          <div className="px-6 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Youtube className="w-5 h-5 text-white fill-white" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">YouTube Academy</h2>
            </div>
            <button className="text-sm font-bold text-blue-600 flex items-center gap-0.5">
              Browse All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar">
            {COURSES.map((course) => (
              <div key={course.id} className="min-w-[280px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden active:scale-[0.98] transition-all">
                {/* Thumbnail */}
                <div className={`h-36 bg-gradient-to-br ${course.thumbnail} relative flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/5" />
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{course.category}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 leading-snug mb-1 line-clamp-2 h-10">{course.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">by {course.instructor}</p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Users className="w-3 h-3" />
                      <span className="text-xs font-medium">{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium">{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1 text-blue-600">
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-bold">+{course.reward} coins</span>
                    </div>
                    <button className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section className="mt-8 px-6">
          <h2 className="text-lg font-bold mb-4">Explore Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Generative AI', icon: Layout, color: 'bg-indigo-50 text-indigo-600' },
              { name: 'Prompt Eng', icon: Layout, color: 'bg-emerald-50 text-emerald-600' },
              { name: 'Machine Learning', icon: Layout, color: 'bg-orange-50 text-orange-600' },
              { name: 'AI Ethics', icon: Layout, color: 'bg-rose-50 text-rose-600' },
            ].map((cat) => (
              <div key={cat.name} className={`${cat.color} p-4 rounded-2xl flex flex-col gap-2 cursor-pointer active:scale-95 transition-all`}>
                <cat.icon className="w-6 h-6" />
                <span className="text-sm font-bold leading-tight">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Navigation Simulation */}
      <footer className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-8 flex items-center justify-between">
        <div className="w-10 h-10 flex items-center justify-center text-slate-400"><Layout className="w-6 h-6" /></div>
        <div className="w-10 h-10 flex items-center justify-center text-slate-900"><Layout className="w-6 h-6 fill-slate-900" /></div>
        <div className="w-10 h-10 flex items-center justify-center text-slate-400"><Layout className="w-6 h-6" /></div>
        <div className="w-10 h-10 flex items-center justify-center text-slate-400"><Layout className="w-6 h-6" /></div>
      </footer>
    </div>
  );
}

export default CoursesPreview;
