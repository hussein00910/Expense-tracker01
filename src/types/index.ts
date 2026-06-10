export interface ToolParam {
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: "text" | "number" | "select";
  options?: string[];
  defaultValue?: string;
}

export interface SecurityTool {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  params: ToolParam[];
  commandTemplate: string;
}

export interface SecurityModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  tools: SecurityTool[];
}

export interface ExecutionResult {
  command: string;
  output: string;
  duration: number;
  exitCode: number;
}

export interface HistoryEntry {
  id: string;
  toolId: string;
  toolName: string;
  moduleId: string;
  moduleName: string;
  params: Record<string, string>;
  result: ExecutionResult;
  createdAt: string;
}
