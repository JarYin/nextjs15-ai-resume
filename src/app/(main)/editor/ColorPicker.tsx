import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomization } from "@/lib/permission";
import { PopoverContent } from "@radix-ui/react-popover";
import { PaletteIcon } from "lucide-react";
import { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";

interface ColorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();
  const [showPopover, setShowPopover] = useState(false);

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          title="Change resume color"
          onClick={() =>{ 
            if(!canUseCustomization(subscriptionLevel)) {
              premiumModal.setOpen(true);
              return;
            }
            setShowPopover(true)}}
        >
          <PaletteIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
      className="border-none bg-transparent shadow-none" align="end">
        <TwitterPicker color={color} onChange={onChange} triangle="top-right"/>
      </PopoverContent>
    </Popover>
  );
}
