import { useEffect, useState } from "react";
import { Droplet } from "lucide-react";

interface HydraPetProps {
  hydrationPercent: number;
  streak: number;
}

const HydraPet = ({ hydrationPercent, streak }: HydraPetProps) => {
  const [emotion, setEmotion] = useState<"happy" | "neutral" | "sad">("neutral");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (hydrationPercent >= 80) {
      setEmotion("happy");
      setScale(1.2);
    } else if (hydrationPercent >= 50) {
      setEmotion("neutral");
      setScale(1);
    } else {
      setEmotion("sad");
      setScale(0.8);
    }
  }, [hydrationPercent]);

  const getColor = () => {
    if (emotion === "happy") return "text-accent";
    if (emotion === "sad") return "text-muted-foreground opacity-50";
    return "text-accent/70";
  };

  const getEyes = () => {
    if (emotion === "happy") return "^_^";
    if (emotion === "sad") return "T_T";
    return "o_o";
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div
        className={`relative transition-all duration-500 ${
          emotion === "happy" ? "animate-bounce" : ""
        }`}
        style={{ transform: `scale(${scale})` }}
      >
        <Droplet className={`h-32 w-32 ${getColor()} hydra-pulse`} fill="currentColor" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-background">
          {getEyes()}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-bold">HydraPet</h3>
        <p className="text-sm text-muted-foreground">
          {emotion === "happy" && "Feeling great! Keep it up! 💪"}
          {emotion === "neutral" && "Doing okay... 😊"}
          {emotion === "sad" && "Need water... 😢"}
        </p>
        {streak > 0 && (
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
            🔥 {streak} day streak!
          </div>
        )}
      </div>
    </div>
  );
};

export default HydraPet;
