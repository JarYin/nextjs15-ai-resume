import { ResumeValues } from "./validation";

export interface EditorFromProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
}