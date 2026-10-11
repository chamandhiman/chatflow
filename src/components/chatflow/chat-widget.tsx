import { useState } from "react";
import { ArrowUp, ChevronDown, MessageCircle, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import mark from "@/assets/chatflow-mark.png";
import type { Chatbot, ChatMessage } from "@/types/chatbot";
export function ChatWidgetPreview({ bot, mobile = false }: { bot: Chatbot; mobile?: boolean }) {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "assistant",
        text: "This is a sample preview response. In the connected product, your assistant would answer using your business knowledge.",
      },
    ]);
  }
  return (
    <div
      className={`widget-${bot.color} ${bot.theme === "light" ? "widget-light" : ""} flex flex-col ${bot.position === "left" ? "items-start" : "items-end"} ${mobile ? "w-[290px]" : "w-[330px]"} max-w-full`}
    >
      {open && (
        <div className="mb-4 flex h-[420px] w-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          <div className="widget-header flex items-center gap-3 p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
              <img src={mark} width={26} height={26} alt="ChatFlow assistant" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold">{bot.name}</h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-[10px]">
                <span className="size-1.5 rounded-full bg-primary-foreground" />
                Here to help you
              </p>
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              className="ml-auto text-primary-foreground"
              aria-label="Minimize chat"
              onClick={() => setOpen(false)}
            >
              <ChevronDown />
            </Button>
          </div>
          <Conversation>
            <ConversationContent className="gap-4 px-4 py-5">
              <div className="text-center text-[9px] text-muted-foreground">
                Live preview · sample conversation
              </div>
              <Message from="assistant">
                <MessageContent>
                  <MessageResponse>{bot.greeting}</MessageResponse>
                </MessageContent>
              </Message>
              {messages.length === 0 && (
                <div className="mt-4 space-y-2">
                  {[
                    "How can I get started?",
                    "What plans do you offer?",
                    "I need help with my account",
                  ].map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      className="h-8 w-full justify-start rounded-md text-[10px]"
                      onClick={() => send(q)}
                    >
                      {q}
                      <ArrowUp className="ml-auto size-3 rotate-45" />
                    </Button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <Message key={i} from={m.role}>
                  <MessageContent className="group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground">
                    <MessageResponse>{m.text}</MessageResponse>
                  </MessageContent>
                </Message>
              ))}
            </ConversationContent>
          </Conversation>
          <div className="border-t border-border px-3 pt-3">
            <PromptInput onSubmit={({ text }) => send(text)}>
              <PromptInputTextarea
                aria-label="Preview message"
                placeholder="Type your message…"
                className="min-h-[42px] text-xs"
              />
              <PromptInputFooter className="justify-end pb-2">
                <PromptInputSubmit aria-label="Send preview message" status="ready">
                  <ArrowUp />
                </PromptInputSubmit>
              </PromptInputFooter>
            </PromptInput>
            <div className="flex items-center justify-center gap-1.5 py-2 text-[8px] text-muted-foreground">
              <ShieldCheck className="size-2.5" />
              Powered by ChatFlow AI
            </div>
          </div>
        </div>
      )}
      <Button
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen(!open)}
        className={`widget-header rounded-full p-0 ${bot.launcherSize < 50 ? "size-11" : bot.launcherSize > 60 ? "size-16" : "size-14"}`}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </Button>
    </div>
  );
}
