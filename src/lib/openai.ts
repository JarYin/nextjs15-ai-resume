import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const { text } = await generateText({
    model: openai("deepseek/deepseek-chat:free"),
    prompt: "What is love?"
})

console.log(text)