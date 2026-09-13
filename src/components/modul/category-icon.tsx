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
  Scale,
  Landmark,
  ShieldAlert,
  Brain,
  BarChart2,
  Database,
  Network,
  Server,
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
    case "bot":
    case "agent":
      return Bot;
    case "reinforcement":
      return Compass;
    case "speech":
      return Mic;
    case "expert_systems":
      return Cpu;
    case "knowledge_rep":
      return Share2;
    case "ethics":
    case "ai_ethics":
      return Scale;
    case "governance":
    case "ai_governance":
      return Landmark;
    case "security":
    case "ai_security":
      return ShieldAlert;
    case "automl":
      return Network;
    case "computational_intelligence":
      return BrainCircuit;
    case "data_analyst":
    case "data_analytics":
      return BarChart2;
    case "data_engineering":
    case "database":
      return Database;
    case "edge_ai":
    case "tinyml":
      return Cpu;
    case "gnn":
    case "graph_neural_network":
      return Network;
    case "mlops":
    case "mlops_deployment":
      return Server;
    default:
      return Brain;
  }
}
