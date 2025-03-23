"use server"

import { GenerateSummaryInput, generateSummarySchema } from "@/lib/validation";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export async function generateSummary(input: GenerateSummaryInput) {
    const { jobTitle, workExperience, educations, skills } = generateSummarySchema.parse(input);

    const systemMessage = `
        You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
        Only return the summary and do not include any other information in the response. Keep it concise and professional.
    `

    const userMessage = `
    Please generate a professional resume summary from this data: 
    
    Job Title: ${jobTitle || "N/A"}

    Work Experience: ${workExperience?.map(exp => `
        position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}
        description: ${exp.description || "N/A"}
        `).join("\n\n") || "N/A"}

    Education: ${educations?.map(edu => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `).join("\n\n") || "N/A"}

    Skills: ${skills} 
    `

    console.log({ "systemMessage": systemMessage, "userMessage": userMessage })

    const completion = await streamText({
        model: openrouter('deepseek/deepseek-chat:free'),
        messages: [{
            role: 'system',
            content: systemMessage
        }, {
            role: 'user',
            content: userMessage
        }]
    })

    let aiResponse = "";
    for await (const part of completion.textStream) {
        aiResponse += part;
    }

    if (!aiResponse) {
        throw new Error("Failed to generate AI response")
    }

    console.log(aiResponse)

    return aiResponse
}