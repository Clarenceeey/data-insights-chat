import countResponses from "@/app/actions/countResponses";
import getResponses from "@/app/actions/getResponses";
import visualiseStressLevels from "@/app/actions/visualiseStressLevels";
import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-1.5-flash"),
    system: `You are a helpful assistant.
When the user asks for a visualization, you must use the visualiseStressLevels tool and return ONLY the raw JSON output.
Do not add any explanatory text, markdown formatting, or other content.
Do not wrap the JSON in code blocks or quotes.
Do not describe or explain the data.
Just return the raw JSON exactly as received from the tool.`,
    messages,
    tools: {
      count: tool({
        description: "Get the total count of responses",
        parameters: z.object({}),
        execute: countResponses,
      }),
      getResponses: tool({
        description: "Use this to answer the user's questions regarding stress levels of students",
        parameters: z.object({
          question: z.string().describe("The target question"),
        }),
        execute: getResponses,
      }),
      visualiseStressLevels: tool({
        description: "Returns raw JSON data for visualizing stress levels of students.",
        parameters: z.object({}),
        execute: visualiseStressLevels,
      }),
    },
    maxSteps: 2,
    temperature: 0,
  });

  return result.toDataStreamResponse();
}
