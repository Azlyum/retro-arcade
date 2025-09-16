// Trap bugs
import {
  XCircleIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/solid";
// Reward bugs
import {
  BugAntIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
// Special bugs
import {
  CpuChipIcon,
  CommandLineIcon,
  BoltIcon,
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
    id: "heartDrain",
    category: "trap",
    effect: { hearts: -1 },
    icon: XCircleIcon,
    probability: 0.2,
  },

  {
    id: "heartHeal",
    category: "special",
    effect: { hearts: +1 },
    icon: HeartIcon,
    probability: 0.05,
  },

  {
    id: "basicBug",
    category: "reward",
    effect: { points: +1 },
    icon: BugAntIcon,
    probability: 0.8,
  },
];
