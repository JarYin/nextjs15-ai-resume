import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BorderStyles } from "../editor/BorderStyleButton";
import { formatDate } from "date-fns";
interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export default function ModernTwoTemplate({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  return (
    <div
      className={cn(
        "bg-white text-black h-fit w-full aspect-[210/297]",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{ zoom: (1 / 794) * width }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
      </div>
    </div>
  );
}

interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
}

function PersonalInfoHeader({ resumeData }: ResumePreviewSectionProps) {
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    colorHex,
    borderStyle,
  } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectURL = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectURL) setPhotoSrc(objectURL);
    if (photo === null) setPhotoSrc("");
    return () => {
      URL.revokeObjectURL(objectURL);
    };
  }, [photo]);

  return (
    <div className="flex items-center gap-6 w-full">
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt="Author photo"
          className="aspect-square object-cover"
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                  ? "9999px"
                  : "10%",
          }}
        />
      )}
      <div className="space-y-2.5 flex-1">
        <div className="space-y-1">
          <p
            className="text-3xl font-bold text-center"
            style={{ color: colorHex }}
          >
            {firstName} {lastName}
          </p>
          <p className="font-medium text-center" style={{ color: colorHex }}>
            {jobTitle}
          </p>
        </div>
        <p className="text-xs text-gray-500 text-center">
          {city}
          {city && country ? ", " : ""}
          {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: ResumePreviewSectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return;

  return (
    <>
      <div className="space-y-3 break-inside-avoid">
        <div className="whitespace-pre-line text-sm indent-8">{summary}</div>
      </div>
      <hr className="border-2" style={{ borderColor: colorHex }}></hr>
    </>
  );
}

function SkillsSection({ resumeData }: ResumePreviewSectionProps) {
  const { skills, colorHex } = resumeData;
  const skillsNotEmpty = skills?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!skillsNotEmpty?.length) return null;

  return (
    <>
      <div className="break-inside-avoid space-y-1">
        <p className="text-xl font-semibold" style={{ color: colorHex }}>
          Skills
        </p>
        <div className="flex break-inside-avoid flex-wrap gap-1 text-sm">
          {skills?.map((skill, index) => <div key={index}>{skill}</div>)}
        </div>
      </div>
    </>
  );
}

function WorkExperienceSection({ resumeData }: ResumePreviewSectionProps) {
  const { workExperience, colorHex } = resumeData;
  const workExperienceNotEmpty = workExperience?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperienceNotEmpty || workExperienceNotEmpty.length === 0)
    return null;
  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Work Experience
        </p>
        {workExperienceNotEmpty.map((exp, index) => (
          <div key={index} className="break-before-avoid space-y-1">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{ color: colorHex }}
            >
              <span>{exp.position}</span>
              {exp.startDate && (
                <span>
                  {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                  {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{exp.company}</p>
            <div className="whitespace-pre-line text-xs">{exp.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function EducationSection({ resumeData }: ResumePreviewSectionProps) {
  const { educations, colorHex } = resumeData;
  const educationSectionNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationSectionNotEmpty?.length) return null;
  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Education
        </p>
        {educationSectionNotEmpty.map((edu, index) => (
          <div key={index} className="break-before-avoid space-y-1">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{edu.degree}</span>
              {edu.startDate && (
                <span>
                  {edu.startDate && (
                    <span>
                      {edu.startDate &&
                        `${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`}
                    </span>
                  )}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{edu.school}</p>
          </div>
        ))}
      </div>
    </>
  );
}
