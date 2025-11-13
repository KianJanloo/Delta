export type ContactMessageStatus = "new" | "in_progress" | "resolved" | string;

export interface ContactMessage {
  id: number | string;
  title?: string | null;
  message?: string | null;
}


