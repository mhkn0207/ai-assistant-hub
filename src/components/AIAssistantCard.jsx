export default function AIAssistantCard({ title, icon, description, gradient, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white,transparent)]"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/90 text-sm leading-relaxed">{description}</p>
        
        {/* Arrow Icon */}
        <div className="mt-6 flex items-center text-white/80 group-hover:text-white transition-colors">
          <span className="text-sm font-medium">Get Started</span>
          <svg
            className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

