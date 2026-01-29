"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutTemplate, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { templates } from "@/lib/template";

interface TemplateProps {
    onChange: (templateId: string) => void;
}

const categories = [
  "all",
  ...Array.from(new Set(templates.map((t) => t.category))),
];

export default function TemplateSelectorDialog({ onChange }: TemplateProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("modern-1");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(selectedTemplate);
    setOpen(false);
  };

  const TemplateGrid = ({ items }: { items: typeof templates }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-1">
      {items.map((template) => (
        <div
          key={template.id}
          onClick={() => setSelectedTemplate(template.id)}
          className={cn(
            "cursor-pointer relative group rounded-xl border-2 p-1 transition-all hover:border-primary/50",
            selectedTemplate === template.id
              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
              : "border-transparent",
          )}
        >
          <div
            className={cn(
              "aspect-[3/4] w-full rounded-lg border flex items-center justify-center",
              template.color,
            )}
          >
            <div className="text-xs font-semibold text-muted-foreground/50">
              {" "}
              {template.img ? (
                <Image
                  src={template.img}
                  height={150}
                  width={150}
                  alt="logo"
                  className="mx-auto md:ms-0"
                />
              ) : (
                <span className="text-xs font-semibold text-muted-foreground/50">PREVIEW</span>
              )}
            </div>
          </div>
          <div className="mt-2 text-center text-sm font-medium capitalize">
            {template.name}
          </div>
          {selectedTemplate === template.id && (
            <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Check className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <LayoutTemplate className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl h-[80vh] sm:h-auto flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader>
            <DialogTitle>Choose a template</DialogTitle>
            <DialogDescription>
              Select a layout from the categories below.
            </DialogDescription>
          </DialogHeader>

          {/* PARTITION: Tabs for Categorization */}
          <Tabs defaultValue="all" className="flex-1 flex flex-col mt-4">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="modern">Modern</TabsTrigger>
              <TabsTrigger value="professional">Pro</TabsTrigger>
              <TabsTrigger value="creative">Creative</TabsTrigger>
            </TabsList>

            {/* PARTITION: Scroll Area for Infinite Growth Protection */}
            <div className="flex-1 min-h-0 mt-4 border rounded-md p-2">
              <ScrollArea className="h-[400px] pr-4">
                <TabsContent value="all" className="mt-0">
                  <TemplateGrid items={templates} />
                </TabsContent>

                {categories
                  .filter((c) => c !== "all")
                  .map((category) => (
                    <TabsContent
                      key={category}
                      value={category}
                      className="mt-0"
                    >
                      <TemplateGrid
                        items={templates.filter((t) => t.category === category)}
                      />
                    </TabsContent>
                  ))}
              </ScrollArea>
            </div>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Apply Template</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
