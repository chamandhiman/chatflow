import { createContext, useContext, useState, type ReactNode } from "react";
import { initialBots, initialSources, initialConversations } from "./mockData";
import type { Chatbot, Source, ConversationRecord } from "@/types/chatbot";
interface PrototypeState {
  bots: Chatbot[];
  setBots: React.Dispatch<React.SetStateAction<Chatbot[]>>;
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
  conversations: ConversationRecord[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationRecord[]>>;
  wizardOpen: boolean;
  setWizardOpen: (open: boolean) => void;
  plan: string;
  setPlan: (plan: string) => void;
}
const Context = createContext<PrototypeState | null>(null);
export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [bots, setBots] = useState(initialBots);
  const [sources, setSources] = useState(initialSources);
  const [conversations, setConversations] = useState(initialConversations);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [plan, setPlan] = useState("Business");
  return (
    <Context.Provider
      value={{
        bots,
        setBots,
        sources,
        setSources,
        conversations,
        setConversations,
        wizardOpen,
        setWizardOpen,
        plan,
        setPlan,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePrototype() {
  const value = useContext(Context);
  if (!value) throw new Error("PrototypeProvider is required");
  return value;
}
