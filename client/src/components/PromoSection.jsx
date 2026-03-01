import React from "react";
import { useNavigate } from "react-router-dom";

const PromoSection = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-500 py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left Content */}
        <div className="text-white space-y-6">
          <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
            🔥 Limited Time Offer
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Get <span className="text-yellow-300">20% OFF</span> on All Products
          </h1>

          <p className="text-lg text-white/90">
            Shop smarter with our <span className="font-semibold">AI Chat Helper</span>. 
            Get instant product guidance, personalized recommendations, and find exactly what you need in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
              Shop & Save Now
            </button>
            <button
              className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-xl hover:bg-white/30 transition duration-300"
              onClick={() => navigate("/ai-chat")}
            >
              Chat With AI
            </button>
          </div>
        </div>

        {/* Right Visual Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full opacity-30"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-200 rounded-full opacity-30"></div>

          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">
              🤖 AI Chat Helper
            </h3>
            <p className="text-gray-600">
              Ask anything about products, compare features, and receive smart suggestions instantly.
            </p>

            <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700">
              <p><strong>You:</strong> Which laptop is best for coding?</p>
              <p className="mt-2"><strong>AI:</strong> Based on performance & budget, I recommend the Pro X 360 with 16GB RAM.</p>
            </div>

            <div className="text-sm text-green-600 font-semibold">
              ✔ 24/7 Smart Assistance
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
