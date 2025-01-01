"use client";

import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "./api/chat",
  });

  return (
    <div className="flex flex-col w-full max-w-xl h-screen mx-auto bg-white">
      {/* Header */}
      <div className="p-4 text-black text-center rounded-t-lg">
        <h1 className="text-lg font-bold">Chat with AI</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages
          .filter((m) => m.content.trim() !== "")
          .map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} mb-4`}
            >
              {m.role !== "user" && <img src="/image.png" className="w-8 h-8 rounded-full mr-2" />}
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  m.role === "user" ? "bg-gray-200 text-gray-800" : "bg-white text-black"
                }`}
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center mb-4 p-2 bg-gray-100 rounded-2xl">
        <input
          className="flex-1 px-4 py-2 mr-2 rounded-lg bg-gray-100 focus:outline-none "
          value={input}
          placeholder="Type your message..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
