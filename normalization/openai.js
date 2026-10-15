import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askOpenAI(answer, instructions) {

  const prompt = Array.isArray(instructions)
      ? instructions.join("\n")
      : instructions;

  const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: prompt,
      input: String(answer)
  });

  return response.output_text.trim();
}