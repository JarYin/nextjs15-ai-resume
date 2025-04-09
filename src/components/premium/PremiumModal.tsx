"use client";
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createCheckoutSession } from "./action";

const premiumFeatures = ["AI tools", "Up to 3 resumes"];
const premiumPlusFeatures = ["Infinite resumes", "Design customization"];

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  async function handlePremiumClick(priceId: string) {
    try {
      setLoading(true);
      const redirectUrl = await createCheckoutSession(priceId);
      window.location.href = redirectUrl!;
    } catch (error) {
      console.error(error);
      toast({
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  }
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
              <Button
                onClick={() =>
                  handlePremiumClick(
                    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY!
                  )
                }
                disabled={loading}
              >
                Get Premium
              </Button>
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
              <Button
                variant={"premium"}
                onClick={() =>
                  handlePremiumClick(
                    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY!
                  )
                }
                disabled={loading}
              >
                Get Premium
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
