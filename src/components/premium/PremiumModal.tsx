"use client";
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";

const premiumFeatures = ["AI tools", "Up to 3 resumes"];
const premiumPlusFeatures = ["Infinite resumes", "Design customization"];

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resume Builder AI Premium</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>Get a premium subscription to unlock more features.</p>
          <div className="flex">
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold">Premium</h3>
              {premiumFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Check className="size-6 text-green-600" />
                  <p>{feature}</p>
                </div>
              ))}
              <Button>Get Premium</Button>
            </div>
            <div className="border-l mx-6" />
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Premium Plus
              </h3>
              {premiumPlusFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Check className="size-6 text-green-600" />
                  <p>{feature}</p>
                </div>
              ))}
              <Button variant={"premium"}>Get Premium</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
