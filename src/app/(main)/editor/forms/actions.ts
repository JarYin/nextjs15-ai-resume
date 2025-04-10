"use server"

import { canUseAITools } from "@/lib/permission";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { GenerateExperienceInput, generateExperienceSchema, GenerateSummaryInput, generateSummarySchema, WorkExperience } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export async function generateSummary(input: GenerateSummaryInput) {
    const {userId} = await auth()

    if (!userId) {
        throw new Error("User not authenticated")
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);

    if(!canUseAITools(subscriptionLevel)) {
        throw new Error("Upgrade your subscription to use this feature")
    }

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

    const completion = streamText({
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


    return aiResponse
}

export async function GenerateExperience(input: GenerateExperienceInput) {
    const {userId} = await auth()

    if (!userId) {
        throw new Error("User not authenticated")
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);

    if(!canUseAITools(subscriptionLevel)) {
        throw new Error("Upgrade your subscription to use this feature")
    }
    
    const { description } = generateExperienceSchema.parse(input);

    const systemMessage = `
        You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
        your response must adhere to the following structure. You can omit fields if they can't be infered from the provided data, but don't add any new ones.
        
        Job title: <job title>
        Company: <company name>
        Start date: <format: YYYY-MM-DD> (only if provided)
        End date: <format: YYYY-MM-DD> (only if provided)
        Description: <an optimized description in bullet format, might be infered from the job title>
    `

    const userMessage = `
    Please provide a work experience entry from this description: ${description}
    `

    const completion = streamText({
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


    return {
        position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
        company: aiResponse.match(/Company: (.*)/)?.[1] || "",
        description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
        startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
        endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
    } satisfies WorkExperience;

}