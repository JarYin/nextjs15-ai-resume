import { auth } from "@clerk/nextjs/server";
import ResumeEditor from "./ResumeEditor";
import prisma from "@/lib/prisma";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export const metadata = {
  title: "Design your resume",
};

export default async function Page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams;

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const resumeToEdit = resumeId
    ? (await prisma.resume.findUnique({
        where: { id: resumeId, userId },
        include: {
          workExperiences: true,
          educations: true,
        },
      })) || null
    : null;
    
  return <ResumeEditor resumeToEdit={resumeToEdit}  />;
}
