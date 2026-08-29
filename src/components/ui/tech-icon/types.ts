export type TechIconKey =
  | "python"
  | "javascript"
  | "typescript"
  | "cpp"
  | "csharp"
  | "c"
  | "java"
  | "kotlin"
  | "swift"
  | "golang"
  | "rust"
  | "php"
  | "ruby"
  | "dart"
  | "html"
  | "css"
  | "sql"
  | "mysql"
  | "postgresql"
  | "mongodb"
  | "redis"
  | "sqlite"
  | "react"
  | "nextjs"
  | "vue"
  | "angular"
  | "svelte"
  | "node"
  | "laravel"
  | "django"
  | "spring"
  | "flutter"
  | "android"
  | "apple"
  | "docker"
  | "kubernetes"
  | "linux"
  | "git"
  | "github"
  | "aws"
  | "gcp"
  | "azure"
  | "nginx"
  | "figma"
  | "excel"
  | "machine_learning"
  | "deep_learning"
  | "nlp"
  | "computer_vision"
  | "generative_ai"
  | "speech"
  | "expert_systems"
  | "robotics"
  | "reinforcement"
  | "knowledge_rep"
  | "data_science"
  | "data_analytics"
  | "algorithm"
  | "security"
  | "math"
  | "computer_systems"
  | "web_dev"
  | "mobile_dev"
  | "database"
  | "code";

export interface TechIconOption {
  key: TechIconKey;
  label: string;
  category: "Bahasa Pemrograman" | "Framework & Web" | "Database & Cloud" | "AI & Data Science" | "Umum";
  color: string;
}

export interface TechIconProps {
  name: string | null | undefined;
  size?: number;
  className?: string;
  animate?: boolean;
  withBg?: boolean;
}

export interface TechIconPickerProps {
  selectedKey?: string | null;
  onSelect: (key: TechIconKey) => void;
}
