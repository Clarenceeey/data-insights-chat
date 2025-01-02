"use server";

import { responses } from "@/app/data/responses";

// This function returns a stringified version of the responses
export default async function visualiseStressLevels() {
  const mentalHealthRatings = responses.map((response) => ({
    id: response.id, // Include the ID if needed for uniqueness
    date: response.date, // Include the date if required
    mentalHealthRating:
      response[
        "On a scale from 1 to 10, how would you rate your overall mental health during the academic year?"
      ],
  }));

  // Count the frequency of each mental health rating (1-10)
  const frequency = Array(10).fill(0); // Initialize an array with 10 slots for ratings 1-10

  mentalHealthRatings.forEach(({ mentalHealthRating }) => {
    frequency[mentalHealthRating - 1]++; // Increment the count for the respective rating
  });

  // Prepare data for Chart.js
  const chartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], // Ratings 1-10
    datasets: [
      {
        label: "Number of Students",
        data: frequency,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return JSON.stringify(chartData);
}
