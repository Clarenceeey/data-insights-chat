"use client";

import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "./api/chat",
  });

  const isChartMessage = (message) => {
    try {
      // Extract JSON part wrapped in backticks
      if (message.role !== "user") {
        console.log(`message: ${message.content}`);
      }
      const jsonMatch = message.content.match(/```json([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        const jsonString = jsonMatch[1].trim(); // Extract the JSON string
        const data = JSON.parse(jsonString); // Parse the JSON
        return data.labels && data.datasets; // Check if it's valid chart data
      }
      return false;
    } catch (error) {
      console.error("Error parsing chart message:", error);
      return false; // Not valid JSON
    }
  };

  const mockChartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
      {
        label: "Number of Students",
        data: [2, 3, 5, 1, 0, 4, 2, 6, 7, 3],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

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
          .map((m) => {
            if (isChartMessage(m)) {
              console.log("chart");
              const chartData = JSON.parse(m.content); // Parse chart data
              return (
                <div key={m.id} className="flex justify-start mb-4 w-full max-w-xs">
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: true,
                          position: "top",
                        },
                        tooltip: {
                          enabled: true,
                        },
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Mental Health Ratings (1-10)",
                          },
                        },
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Number of Students",
                          },
                        },
                      },
                    }}
                  />
                </div>
              );
            } else {
              return (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  {m.role !== "user" && (
                    <img src="/image.png" className="w-8 h-8 rounded-full mr-2" alt="AI Avatar" />
                  )}
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      m.role === "user" ? "bg-gray-200 text-gray-800" : "bg-white text-black"
                    }`}
                  >
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              );
            }
          })}
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
