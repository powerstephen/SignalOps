export type WorkspaceSourceId =
  | "hubspot"
  | "google_sheets"
  | "csv"
  | "sample";

export type WorkspaceSource = {
  id: WorkspaceSourceId;
  label: string;
  status: "connected" | "demo" | "available";
};

export const WORKSPACE_SOURCES: Record<WorkspaceSourceId, WorkspaceSource> = {
  hubspot: {
    id: "hubspot",
    label: "HubSpot CRM",
    status: "connected",
  },
  google_sheets: {
    id: "google_sheets",
    label: "Google Sheet",
    status: "available",
  },
  csv: {
    id: "csv",
    label: "CSV Upload",
    status: "available",
  },
  sample: {
    id: "sample",
    label: "Sample workspace",
    status: "demo",
  },
};

export const WORKSPACE_SOURCE_STORAGE_KEY = "signalops_workspace_source";
export const DEFAULT_WORKSPACE_SOURCE: WorkspaceSourceId = "hubspot";

export function getWorkspaceSourceLabel(sourceId?: string | null) {
  if (!sourceId) return WORKSPACE_SOURCES[DEFAULT_WORKSPACE_SOURCE].label;
  return (
    WORKSPACE_SOURCES[sourceId as WorkspaceSourceId]?.label ??
    WORKSPACE_SOURCES[DEFAULT_WORKSPACE_SOURCE].label
  );
}
