"use server"

import { resumeSchema, ResumeValues } from "@/lib/validation"
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { del, put } from "@vercel/blob";
import path from "path";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canCreateResume, canUseCustomization } from "@/lib/permission";


export async function saveResume(values: ResumeValues) {
    const { id } = values;

    const { photo, workExperience, educations, ...resumeValues } = resumeSchema.parse(values);

    const { userId } = await auth()

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);

    if (!id) {
        const resumeCount = await prisma.resume.count({ where: { userId } })

        if (!canCreateResume(subscriptionLevel, resumeCount)) {
            throw new Error("You have reached the maximum number of resumes for your subscription level")
        }
    }

    const existingResume = id ? await prisma.resume.findUnique({ where: { id, userId } }) : null;

    if (id && !existingResume) {
        throw new Error("Resume not found");
    }

    const hasCustomizations = (resumeValues.borderStyle && resumeValues.borderStyle !== existingResume?.borderStyle) 
    || (resumeValues.colorHex && resumeValues.colorHex !== existingResume?.colorHex)

    if(hasCustomizations && !canUseCustomization(subscriptionLevel)) {
        throw new Error("Customization not allowed for this subscription level")
    }

    let newPhotoUrl: string | undefined | null = undefined;

    if (photo instanceof File) {
        if (existingResume?.photoUrl) {
            await del(existingResume.photoUrl);
        }

        const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
            access: "public"
        })

        newPhotoUrl = blob.url;
    } else if (photo === null) {
        if (existingResume?.photoUrl) {
            await del(existingResume.photoUrl);
        }
        newPhotoUrl = null;
    }

    if (id) {
        return prisma.resume.update({
            where: { id },
            data: {
                ...resumeValues,
                photoUrl: newPhotoUrl,
                workExperiences: {
                    deleteMany: {},
                    create: workExperience?.map(exp => ({
                        ...exp,
                        startDate: exp.startDate ? new Date(exp.startDate) : undefined,
                        endDate: exp.endDate ? new Date(exp.endDate) : undefined
                    }))
                },
                educations: {
                    deleteMany: {},
                    create: educations?.map(edu => ({
                        ...edu,
                        startDate: edu.startDate ? new Date(edu.startDate) : undefined,
                        endDate: edu.endDate ? new Date(edu.endDate) : undefined
                    }))
                },
                updatedAt: new Date(),
            }
        })
    } else {
        return prisma.resume.create({
            data: {
                ...resumeValues,
                userId,
                photoUrl: newPhotoUrl,
                workExperiences: {
                    create: workExperience?.map(exp => ({
                        ...exp,
                        startDate: exp.startDate ? new Date(exp.startDate) : undefined,
                        endDate: exp.endDate ? new Date(exp.endDate) : undefined
                    }))
                },
                educations: {
                    create: educations?.map(edu => ({
                        ...edu,
                        startDate: edu.startDate ? new Date(edu.startDate) : undefined,
                        endDate: edu.endDate ? new Date(edu.endDate) : undefined
                    }))
                }
            }
        })
    }
}