import {
  CodeBracketIcon,
  CommandLineIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

export type BugPoolProps = {
  id: string;
  category: "reward" | "trap" | "special";
  effect: { hearts?: number; points?: number; time?: number };
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  probability: number;
  style?: string;
};

export const bugPool: BugPoolProps[] = [
  {
    id: "basicBug",
    category: "reward",
    effect: { points: 1 },
    icon: CheckCircleIcon,
    probability: 0.65,
    style: "text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]",
  },
  {
    id: "goldBug",
    category: "reward",
    effect: { points: 3 },
    icon: CodeBracketIcon,
    probability: 0.12,
    style:
      "text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)] animate-pulse",
  },
  {
    id: "starBug",
    category: "reward",
    effect: { points: 5 },
    icon: CommandLineIcon,
    probability: 0.05,
    style:
      "text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.9)] animate-bounce",
  },

  {
    id: "heartDrain",
    category: "trap",
    effect: { hearts: -1 },
    icon: ShieldExclamationIcon,
    probability: 0.08,
    style:
      "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse",
  },
  {
    id: "timeDrain",
    category: "trap",
    effect: { time: -5 },
    icon: XMarkIcon,
    probability: 0.05,
    style: "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.7)]",
  },
  {
    id: "skullBug",
    category: "trap",
    effect: { hearts: -2 },
    icon: CpuChipIcon,
    probability: 0.02,
    style:
      "text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.9)] animate-pulse",
  },

  {
    id: "heartHeal",
    category: "special",
    effect: { hearts: 1 },
    icon: ShieldCheckIcon,
    probability: 0.02,
    style:
      "text-pink-400 drop-shadow-[0_0_12px_rgba(244,114,182,0.8)] animate-pulse",
  },
  {
    id: "timeBoost",
    category: "special",
    effect: { time: 10 },
    icon: CpuChipIcon,
    probability: 0.01,
    style: "text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]",
  },
];
