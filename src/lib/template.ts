import resumePreview from "@/assets/resume-preview.jpg";
import resumePreviewModern2 from "@/assets/resume-preview-modern-2.png";
import ProOnePreview from "@/assets/ProOnePreview.png";

export const templates = [
  { id: "modern-1", name: "Default", category: "modern", color: "bg-slate-100", img: resumePreview },
  {
    id: "modern-2",
    name: "Modern Minimal",
    category: "modern",
    color: "bg-slate-100",
    img: resumePreviewModern2
  },
    { id: "pro-1", name: "Pro Minimal", category: "professional", color: "bg-zinc-100", img: ProOnePreview },
  //   { id: "pro-2", name: "Executive", category: "professional", color: "bg-stone-100" },
  //   { id: "creative-1", name: "Bold Peach", category: "creative", color: "bg-orange-100" },
  //   { id: "creative-2", name: "Artist", category: "creative", color: "bg-purple-100" },
  //   { id: "simple-1", name: "Basic", category: "simple", color: "bg-white border-dashed" },
  //   { id: "simple-2", name: "Clean", category: "simple", color: "bg-gray-50" },
];