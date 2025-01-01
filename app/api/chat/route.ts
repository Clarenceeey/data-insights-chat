import countResponses from "@/app/actions/countResponses";
import getResponses from "@/app/actions/getResponses";
import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";
import { responses } from "@/app/data/responses";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const data = JSON.stringify(responses);

  const result = streamText({
    model: google("gemini-1.5-flash"),
    system: `You are a helpful assistant. Use this dataset to answer queries from users. ${data}`,
    messages,
    tools: {
      count: tool({
        description: "Get the total count of responses",
        parameters: z.object({}),
        execute: countResponses,
      }),
      getResponses: tool({
        description: "Get the list of responses",
        parameters: z.object({
          question: z.string().describe("The target question"),
        }),
        execute: getResponses,
      }),
    },
    maxSteps: 2,
  });

  return result.toDataStreamResponse();
}
