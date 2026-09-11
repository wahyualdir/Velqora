import {

  BrainCircuit,
  Layers,
  MessageSquareCode,
  Eye,
  Sparkles,
  Bot,
  Compass,
  Mic,
  Cpu,
  Share2,
  Brain,
  LucideIcon,
} from "lucide-react";

export function getCategoryIconComponent(iconName?: string): LucideIcon {
  switch (iconName?.toLowerCase().trim()) {
    case "machine_learning":
      return BrainCircuit;
    case "deep_learning":
      return Layers;
    case "nlp":
      return MessageSquareCode;
    case "computer_vision":
      return Eye;
    case "generative_ai":
      return Sparkles;
    case "robotics":
      return Bot;
    case "reinforcement":
      return Compass;
    case "speech":
      return Mic;
    case "expert_systems":
      return Cpu;
    case "knowledge_rep":
      return Share2;
    default:
      return Brain;
  }
}
