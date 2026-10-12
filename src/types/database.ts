import type { BotStatus, ChatMessage } from "./chatbot";

export type WorkspaceRole = "Owner" | "Admin" | "Member";

export interface UserDocument {
  id: string; // Firebase Auth UID
  email: string;
  displayName: string;
  photoURL?: string;
  defaultWorkspaceId?: string;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export interface WorkspaceDocument {
  id: string; // Workspace ID
  name: string;
  ownerId: string; // User ID
  domain?: string;
  plan: "Starter" | "Business" | "Agency";
  monthlyMessageLimit: number;
  currentPeriodUsage: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMemberDocument {
  id: string; // Composite: `${workspaceId}_${userId}`
  workspaceId: string;
  userId: string;
  userEmail: string;
  role: WorkspaceRole;
  invitedBy?: string;
  joinedAt: string;
}

export interface ChatbotDocument {
  id: string;
  workspaceId: string;
  name: string;
  domain: string;
  status: BotStatus;
  kind: "support" | "sales" | "appointment" | "docs";
  greeting: string;
  color: string; // "violet" | "cyan" | "amber" | "rose"
  theme: "dark" | "light";
  position: "right" | "left";
  leadCapture: boolean;
  handoff: boolean;
  launcherSize: number;
  suggestedQuestions?: string[];
  responseStyle?: string;
  conversationsCount: number;
  sourcesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeSourceDocument {
  id: string;
  workspaceId: string;
  chatbotId: string;
  name: string;
  type: "Website" | "PDF" | "DOCX" | "TXT" | "FAQ" | "Manual text";
  status: "Ready" | "Processing" | "Failed";
  storagePath?: string; // Firebase Storage reference path
  url?: string;
  contentSnippet?: string;
  sizeBytes?: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDocument {
  id: string;
  workspaceId: string;
  chatbotId: string;
  chatbotName: string;
  visitorName: string;
  visitorEmail: string;
  preview: string;
  status: "Open" | "Resolved" | "Needs Attention";
  unread: boolean;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageDocument {
  id: string;
  conversationId: string;
  workspaceId: string;
  chatbotId: string;
  role: "user" | "assistant";
  text: string;
  note?: boolean; // Internal team note
  senderId?: string; // Member user ID if internal note
  createdAt: string;
}

export interface LeadDocument {
  id: string;
  workspaceId: string;
  chatbotId: string;
  conversationId?: string;
  name: string;
  email: string;
  notes?: string;
  createdAt: string;
}

export interface UsageRecordDocument {
  id: string;
  workspaceId: string;
  periodYearMonth: string; // e.g. "2026-10"
  aiMessagesCount: number;
  activeBotsCount: number;
  lastCalculatedAt: string;
}
