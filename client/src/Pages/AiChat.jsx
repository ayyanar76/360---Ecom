import axios from "axios";
import React, { useMemo, useState } from "react";

const AiChat = () => {
  const api = import.meta.env.VITE_API_KEY;
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I am your AI shopping helper. Ask me about products, prices, stock, or recommendations.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const chatHistory = useMemo(
    () =>
      messages
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .map((msg) => ({ role: msg.role, content: msg.content })),
    [messages]
  );

  const sendMessage = async (e) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    const userMessage = { role: "user", content: prompt };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${api}/aichat`,
        {
          messages: [...chatHistory, userMessage],
        },
        { withCredentials: true }
      );

      const reply = res?.data?.reply || "I could not generate a response right now.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Chat request failed.");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const userHistory = messages
        .filter((msg) => msg.role === "user")
        .slice(-5)
        .map((msg) => msg.content);
      const res = await axios.post(
        `${api}/airecommend`,
        { userHistory, category: "all" },
        { withCredentials: true }
      );
      setRecommendations(res?.data?.products || []);
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Could not fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md flex flex-col h-[75vh]">
          <div className="border-b px-5 py-4 flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">AI Chat Helper</h1>
            <button
              onClick={getRecommendations}
              disabled={loading}
              className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-60"
            >
              Get Recommendations
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm sm:text-base ${
                    msg.role === "user"
                      ? "bg-orange-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="text-sm text-gray-500">AI is typing...</div>
            ) : null}
          </div>

          <form onSubmit={sendMessage} className="border-t p-4 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, prices, stock..."
              className="flex-1 border rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-orange-600 text-white px-5 py-3 rounded-xl hover:bg-orange-700 disabled:opacity-60"
            >
              Send
            </button>
          </form>
          {error ? <p className="px-4 pb-3 text-sm text-red-500">{error}</p> : null}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Smart Picks</h2>
          {recommendations.length === 0 ? (
            <p className="text-sm text-gray-500">
              No recommendations yet. Use "Get Recommendations" to fetch product picks.
            </p>
          ) : (
            <div className="space-y-3">
              {recommendations.map((item) => (
                <div key={item._id} className="border rounded-xl p-3">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                  <p className="text-orange-600 font-bold text-sm mt-1">₹{item.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiChat;
