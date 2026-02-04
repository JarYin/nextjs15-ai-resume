import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export default function CyberpunkTemplate({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "bg-slate-950 text-slate-100 h-fit w-full aspect-[210/297] overflow-hidden relative font-mono",
        className
      )}
      // 1. MERGE REFS: This attaches both the internal logic AND the printer to the Main Wrapper
      ref={(el) => {
        containerRef.current = el;
        if (typeof contentRef === "function") {
          contentRef(el);
        } else if (contentRef) {
          (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
    >
      {/* 2. PRINT STYLES: Forces A4 size and resets Zoom */}
      <style>{`
        @media print {
          /* Force standard A4 dimensions */
          @page {
            size: A4;
            margin: 0;
          }
          /* Reset the main container to full A4 size */
          html, body {
             height: 100%;
          }
          /* Target the main wrapper by class or attribute */
          .aspect-\\[210\\/297\\] {
             width: 210mm !important;
             height: 297mm !important;
             position: absolute;
             top: 0;
             left: 0;
             margin: 0 !important;
             print-color-adjust: exact !important;
             -webkit-print-color-adjust: exact !important;
             background-color: #020617 !important; /* Ensure dark bg prints */
          }
          /* CRITICAL: Reset the zoom on the inner content so it's not tiny */
          #resumePreviewContent {
             zoom: 1 !important;
             width: 100% !important;
             height: 100% !important;
             padding: 30px !important; /* Adjust internal padding for print */
          }
          /* Ensure grid shows up */
          .grid-overlay {
             opacity: 0.2 !important;
             display: block !important;
          }
        }
      `}</style>

      {/* Cyberpunk Grid Background Overlay */}
      <div 
        className="grid-overlay absolute inset-0 opacity-20 pointer-events-none z-0"
        style={{
             backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px),
                              linear-gradient(to bottom, #334155 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
        }}
      />
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-current opacity-50 z-0" style={{ color: resumeData.colorHex }} />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-current opacity-50 z-0" style={{ color: resumeData.colorHex }} />

      <div
        className={cn("space-y-6 p-8 relative z-10", !width && "invisible")}
        // The zoom here is for SCREEN only. The CSS above overrides it for PRINT.
        style={{ zoom: (1 / 794) * width }}
        id="resumePreviewContent"
      >
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        
        <div className="text-[10px] text-slate-600 mt-4 border-t border-slate-800 pt-2 flex justify-between uppercase tracking-widest">
          <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          <span>End of Line_</span>
        </div>
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
    <div className="flex items-center gap-6 w-full pb-6 border-b border-slate-800">
      {photoSrc && (
        <div className="relative group">
            <div className="absolute -inset-1 rounded-sm blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" 
                 style={{ backgroundColor: colorHex }}></div>
            <div className="relative">
                <Image
                src={photoSrc}
                width={110}
                height={110}
                alt="Author photo"
                className="aspect-square object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                style={{
                   clipPath: "polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)",
                   border: `2px solid ${colorHex}`
                }}
                />
            </div>
        </div>
      )}
      <div className="space-y-2 flex-1">
        <div className="space-y-1">
          <h1
            className="text-4xl font-black uppercase tracking-widest leading-none"
            style={{ 
                color: colorHex,
                textShadow: `0 0 10px ${colorHex}40`
            }}
          >
            {firstName} <span className="text-white">{lastName}</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: colorHex }}></span>
            <p className="font-bold text-lg uppercase tracking-wider text-slate-300">
                {jobTitle}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 uppercase tracking-tight font-semibold">
          {[city, country, phone, email].filter(Boolean).map((item, i) => (
             <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-slate-700">|</span>}
                {item}
             </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: ResumePreviewSectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="space-y-2 break-inside-avoid">
       <div className="flex items-center gap-2">
            <span className="text-xs px-1 bg-slate-800 text-slate-400 font-bold">[BIO_DATA]</span>
            <div className="h-[1px] flex-1 bg-slate-800"></div>
       </div>
      <div 
        className="whitespace-pre-line text-sm text-slate-300 leading-relaxed border-l-2 pl-4"
        style={{ borderColor: `${colorHex}60` }}
      >
        {summary}
      </div>
    </div>
  );
}

function SkillsSection({ resumeData }: ResumePreviewSectionProps) {
  const { skills, colorHex } = resumeData;
  const skillsNotEmpty = skills?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!skillsNotEmpty?.length) return null;

  return (
    <div className="break-inside-avoid space-y-3">
      <SectionHeader title="Augmentations / Skills" colorHex={colorHex} />
      
      <div className="flex break-inside-avoid flex-wrap gap-2 text-sm">
        {skills?.map((skill, index) => (
            <div 
                key={index} 
                className="px-3 py-1 bg-slate-900 border text-xs font-bold uppercase tracking-wider transition-all hover:bg-slate-800"
                style={{ 
                    borderColor: `${colorHex}40`,
                    color: colorHex,
                    boxShadow: `0 0 5px ${colorHex}10`
                }}
            >
                {skill}
            </div>
        ))}
      </div>
    </div>
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
    <div className="space-y-4">
      <SectionHeader title="Mission History" colorHex={colorHex} />
      
      <div className="space-y-6">
        {workExperienceNotEmpty.map((exp, index) => (
          <div key={index} className="break-before-avoid relative pl-6 border-l border-slate-800">
            <div 
                className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-none rotate-45 border"
                style={{ backgroundColor: '#020617', borderColor: colorHex }}
            ></div>

            <div className="flex items-start justify-between mb-1">
              <div className="space-y-0.5">
                <span className="text-base font-bold text-white uppercase tracking-wide">
                    {exp.position}
                </span>
                <p 
                    className="text-xs font-bold uppercase"
                    style={{ color: colorHex }}
                >
                    {exp.company}
                </p>
              </div>
              
              {exp.startDate && (
                <div className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 border border-slate-800">
                  {formatDate(exp.startDate, "MM/yy")} -{" "}
                  {exp.endDate ? formatDate(exp.endDate, "MM/yy") : "CURR"}
                </div>
              )}
            </div>
            
            <div className="whitespace-pre-line text-xs text-slate-400 mt-2">
                {exp.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ resumeData }: ResumePreviewSectionProps) {
  const { educations, colorHex } = resumeData;
  const educationSectionNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationSectionNotEmpty?.length) return null;
  return (
    <div className="space-y-4">
      <SectionHeader title="Data Uploads / Education" colorHex={colorHex} />

      <div className="grid grid-cols-1 gap-3">
        {educationSectionNotEmpty.map((edu, index) => (
          <div 
            key={index} 
            className="break-before-avoid p-3 bg-slate-900/50 border border-slate-800 flex items-center justify-between"
            style={{ borderLeft: `3px solid ${colorHex}`}}
          >
            <div>
                <div className="text-sm font-bold text-white uppercase">{edu.degree}</div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{edu.school}</div>
            </div>
            {edu.startDate && (
              <div className="text-[10px] text-slate-500 text-right">
                    {formatDate(edu.startDate, "yyyy")}
                    {edu.endDate ? ` // ${formatDate(edu.endDate, "yyyy")}` : ""}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, colorHex }: { title: string, colorHex?: string }) {
    const dotColor = colorHex ?? "#94a3b8";
    return (
        <div className="flex items-center gap-3 mb-3">
            <div className="h-2 w-2" style={{ backgroundColor: dotColor }}></div>
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-200">
                {title}
            </h3>
            <div className="h-[1px] flex-1 bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
        </div>
    )
}