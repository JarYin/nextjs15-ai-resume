import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BorderStyles } from "../editor/BorderStyleButton";
import { formatDate, parseISO } from "date-fns";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export default function ProOneTemplate({
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
        className={cn("flex flex-col md:flex-row h-full", !width && "invisible")}
        style={{ zoom: (1 / 794) * width }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        {/* Left Column - Dark Background */}
        <LeftColumn resumeData={resumeData} />
        {/* Right Column - Light Background */}
        <RightColumn resumeData={resumeData} />
      </div>
    </div>
  );
}

interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
}

function LeftColumn({ resumeData }: ResumePreviewSectionProps) {
  const {
    photo,
    firstName,
    lastName,
    colorHex,
    borderStyle,
    skills,
  } = resumeData;

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);
  const accentColor = colorHex || "#dc2626"; // Default to red if no color

  useEffect(() => {
    const objectURL = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectURL) setPhotoSrc(objectURL);
    if (photo === null) setPhotoSrc("");
    return () => {
      URL.revokeObjectURL(objectURL);
    };
  }, [photo]);

  const skillsNotEmpty = skills?.filter(Boolean);

  return (
    <div
      className="w-full md:w-[35%] p-4 md:p-6 text-white flex flex-col space-y-4 md:space-y-6"
      style={{ backgroundColor: accentColor }}
    >
      {/* Photo */}
      {photoSrc && (
        <div className="flex justify-center">
          <Image
            src={photoSrc}
            width={120}
            height={120}
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
        </div>
      )}

      {/* Name */}
      {(firstName || lastName) && (
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {firstName} {lastName}
          </h1>
        </div>
      )}

      {/* Contact Info */}
      <ContactSection resumeData={resumeData} />

      {/* Skills */}
      {skillsNotEmpty && skillsNotEmpty.length > 0 && (
        <SkillsSection
          skills={skillsNotEmpty}
          borderStyle={borderStyle}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}

function ContactSection({ resumeData }: ResumePreviewSectionProps) {
  const { phone, email, city, country } = resumeData;
  const hasContact = phone || email || city || country;

  if (!hasContact) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-3">Contact</h2>
      <div className="space-y-1.5 text-sm">
        {phone && (
          <div className="break-words">
            <span className="font-medium">Phone:</span> {phone}
          </div>
        )}
        {email && (
          <div className="break-words">
            <span className="font-medium">Email:</span> {email}
          </div>
        )}
        {(city || country) && (
          <div className="break-words">
            <span className="font-medium">Location:</span>{" "}
            {[city, country].filter(Boolean).join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}

function SkillsSection({
  skills,
  borderStyle,
  accentColor,
}: {
  skills: string[];
  borderStyle?: string;
  accentColor: string;
}) {
  // Create a darker version of the accent color for skill badges
  const getDarkerColor = (color: string) => {
    // Simple darkening - convert hex to RGB, reduce brightness
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const darkerR = Math.max(0, r - 40);
    const darkerG = Math.max(0, g - 40);
    const darkerB = Math.max(0, b - 40);
    return `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
  };

  const skillBgColor = getDarkerColor(accentColor);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold mb-3">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1.5 text-sm font-medium rounded-full text-white"
            style={{
              backgroundColor: skillBgColor,
              borderRadius:
                borderStyle === BorderStyles.SQUARE
                  ? "0px"
                  : borderStyle === BorderStyles.CIRCLE
                    ? "9999px"
                    : "0.5rem",
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function RightColumn({ resumeData }: ResumePreviewSectionProps) {
  const {summary, workExperience, educations, colorHex } =
    resumeData;
  const accentColor = colorHex || "#dc2626";

  return (
    <div className="flex-1 p-4 md:p-6 bg-white space-y-4 md:space-y-6">
      {/* Name and Title Header */}
      <HeaderSection resumeData={resumeData} accentColor={accentColor} />

      {/* Summary */}
      {summary && <SummarySection summary={summary} accentColor={accentColor} />}

      {/* Work Experience */}
      {workExperience && workExperience.length > 0 && (
        <WorkExperienceSection
          workExperience={workExperience}
          accentColor={accentColor}
        />
      )}

      {/* Education */}
      {educations && educations.length > 0 && (
        <EducationSection educations={educations} accentColor={accentColor} />
      )}
    </div>
  );
}

function HeaderSection({
  resumeData,
  accentColor,
}: ResumePreviewSectionProps & { accentColor: string }) {
  const { firstName, lastName, jobTitle } = resumeData;

  return (
    <div className="space-y-1 border-b-2 pb-3" style={{ borderColor: accentColor }}>
      <h1 className="text-3xl font-bold">
        {firstName} {lastName}
      </h1>
      {jobTitle && (
        <p className="text-lg font-medium" style={{ color: accentColor }}>
          {jobTitle}
        </p>
      )}
    </div>
  );
}

function SummarySection({
  summary,
  accentColor,
}: {
  summary: string;
  accentColor: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold" style={{ color: accentColor }}>
        Summary
      </h2>
      <p className="text-sm whitespace-pre-line leading-relaxed">{summary}</p>
    </div>
  );
}

function WorkExperienceSection({
  workExperience,
  accentColor,
}: {
  workExperience: NonNullable<ResumeValues["workExperience"]>;
  accentColor: string;
}) {
  const workExperienceNotEmpty = workExperience.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperienceNotEmpty || workExperienceNotEmpty.length === 0)
    return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold" style={{ color: accentColor }}>
        Experience
      </h2>
      <div className="space-y-4">
        {workExperienceNotEmpty.map((exp, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold">{exp.position}</h3>
                <p className="text-sm font-medium text-gray-700">
                  {exp.company}
                </p>
                {(exp.startDate || exp.endDate) && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    {exp.startDate
                      ? formatDate(
                          typeof exp.startDate === "string"
                            ? parseISO(exp.startDate)
                            : exp.startDate,
                          "MMM yyyy",
                        )
                      : ""}
                    {exp.startDate || exp.endDate ? " - " : ""}
                    {exp.endDate
                      ? formatDate(
                          typeof exp.endDate === "string"
                            ? parseISO(exp.endDate)
                            : exp.endDate,
                          "MMM yyyy",
                        )
                      : exp.startDate
                        ? "Present"
                        : ""}
                  </p>
                )}
              </div>
            </div>
            {exp.description && (
              <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed pl-2 border-l-2"
                style={{ borderColor: accentColor }}>
                <div className="pl-2">{exp.description}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({
  educations,
  accentColor,
}: {
  educations: NonNullable<ResumeValues["educations"]>;
  accentColor: string;
}) {
  const educationSectionNotEmpty = educations.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationSectionNotEmpty?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold" style={{ color: accentColor }}>
        Education
      </h2>
      <div className="space-y-3">
        {educationSectionNotEmpty.map((edu, index) => (
          <div key={index} className="space-y-1">
            <h3 className="text-base font-semibold">{edu.degree}</h3>
            <p className="text-sm font-medium text-gray-700">{edu.school}</p>
            {(edu.startDate || edu.endDate) && (
              <p className="text-xs text-gray-600">
                {edu.startDate
                  ? formatDate(
                      typeof edu.startDate === "string"
                        ? parseISO(edu.startDate)
                        : edu.startDate,
                      "MMM yyyy",
                    )
                  : ""}{" "}
                {edu.endDate
                  ? `- ${formatDate(
                      typeof edu.endDate === "string"
                        ? parseISO(edu.endDate)
                        : edu.endDate,
                      "MMM yyyy",
                    )}`
                  : ""}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
