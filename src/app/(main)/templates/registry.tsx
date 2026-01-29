import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const resumeTemplates = {
  "modern-1": dynamic(() => import("@/components/ResumePreview"), {
    loading: () => <Skeleton />,
  }),
  "modern-2": dynamic(() => import("./ModernTwoTemplate"), {
    loading: () => <Skeleton />,
  }),
};
