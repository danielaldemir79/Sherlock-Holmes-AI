import { ResponseMessageProps } from "../models/ResponseMessageProps";

const CHAT_INDEX_KEY = "chatIndex";

export function SaveChatWithId(id: string, chatData: ResponseMessageProps[]): void {
  localStorage.setItem(id, JSON.stringify(chatData));

  const index = LoadChatIndex();
  const updated = Array.from(new Set([...index, id]));
  localStorage.setItem(CHAT_INDEX_KEY, JSON.stringify(updated));
}

export function LoadChat(key: string): ResponseMessageProps[] | null {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) as ResponseMessageProps[] : null;
}

export function LoadChatIndex(): string[] {
  const stored = localStorage.getItem(CHAT_INDEX_KEY);
  return stored ? JSON.parse(stored) : [];
}