export type BotStatus = "Published" | "Draft" | "Paused";
export interface Chatbot {
  id: string;
  name: string;
  domain: string;
  status: BotStatus;
  conversations: number;
  sources: number;
  activity: string;
  kind: "support" | "sales" | "appointment" | "docs";
  greeting: string;
  color: string;
  theme: "dark" | "light";
  position: "right" | "left";
  leadCapture: boolean;
  handoff: boolean;
  launcherSize: number;
}
export interface Source {
  id: string;
  name: string;
  type: string;
  bot: string;
  status: "Ready" | "Processing" | "Failed";
  updated: string;
}
export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  note?: boolean;
}
export interface ConversationRecord {
  id: string;
  name: string;
  email: string;
  preview: string;
  bot: string;
  time: string;
  status: "Open" | "Resolved" | "Needs Attention";
  unread: boolean;
  messages: ChatMessage[];
}
