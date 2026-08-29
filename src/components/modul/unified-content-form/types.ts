import { Module } from "@/types";

export interface UnifiedContentFormProps {
  initialKind?: "module" | "project";
  initialData?: Module | null;
  isEditing?: boolean;
  onSuccess?: (id: string) => void;
}
