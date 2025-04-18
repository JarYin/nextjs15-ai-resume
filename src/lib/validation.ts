import { z } from 'zod';

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
    title: optionalString,
    description: optionalString,
})

export type generalInfoValues = z.infer<typeof generalInfoSchema>;

export const personalInfoSchema = z.object({
    photo: z.custom<File | undefined>().refine((file) => !file || (file instanceof File && file.type.startsWith("image/")),
        "Must be an image file."
    ).refine((file) => !file || file.size < 1024 * 1024 * 10,
        "File must be less than 10MB"
    ),
    firstName: optionalString,
    lastName: optionalString,
    jobTitle: optionalString,
    city: optionalString,
    country: optionalString,
    phone: optionalString,
    email: optionalString,
})

export type personalInfoValues = z.infer<typeof personalInfoSchema>;

export const workExperienceSchema = z.object({
    workExperience: z.array(z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
    })).optional(),
})

export type workExperienceValues = z.infer<typeof workExperienceSchema>;

export type WorkExperience = NonNullable<z.infer<typeof workExperienceSchema>["workExperience"]>[number];

export const educationSchema = z.object({
    educations: z.array(z.object({
        school: optionalString,
        degree: optionalString,
        startDate: optionalString,
        endDate: optionalString,
    })).optional(),
});

export type EducationsValues = z.infer<typeof educationSchema>;

export const skillSchema = z.object({
    skills: z.array(z.string().trim()).optional()
});

export type SkillValues = z.infer<typeof skillSchema>;

export const summarySchema = z.object({
    summary: optionalString
});

export type SummaryValues = z.infer<typeof summarySchema>;

export const resumeSchema = z.object({
    ...generalInfoSchema.shape,
    ...personalInfoSchema.shape,
    ...workExperienceSchema.shape,
    ...educationSchema.shape,
    ...skillSchema.shape,
    ...summarySchema.shape,
    colorHex: optionalString,
    borderStyle: optionalString,
})

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
    id?: string;
    photo?: File | string | null;
}

export const generateSummarySchema = z.object({
    jobTitle: optionalString,
    ...workExperienceSchema.shape,
    ...educationSchema.shape,
    ...skillSchema.shape,
})

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;

export const generateExperienceSchema = z.object({
    description: z.string().trim().min(1, "Required").min(20, "Must be at least 20 characters"),
});

export type GenerateExperienceInput = z.infer<typeof generateExperienceSchema>;