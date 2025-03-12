import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useEffect, useState } from "react";

export default function useAutoSaveResume(resume: ResumeValues) {
    const debouncedResumeData = useDebounce(resume, 1000);

    const [lastestResumeData, setLastestResumeData] = useState(structuredClone(resume));

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function save() {
            setIsSaving(true);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setLastestResumeData(structuredClone(debouncedResumeData));
            setIsSaving(false);
        }

        const hasUnSavedChanges = JSON.stringify(debouncedResumeData) !== JSON.stringify(lastestResumeData);

        if (hasUnSavedChanges && debouncedResumeData && !isSaving) {
            save()
        }

    }, [debouncedResumeData, lastestResumeData, isSaving]);

    return { isSaving, hasUnSavedChanges: JSON.stringify(resume) !== JSON.stringify(lastestResumeData) };
}