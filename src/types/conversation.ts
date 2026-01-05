import { z } from "zod";

// Zod Schemas
export const startConversationSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
  rideId: z.string().optional(),
});

export type StartConversationFormValues = z.infer<typeof startConversationSchema>;

// TypeScript Types
export interface Message {
  _id: string;
  conversation: string;
  sender: string | { _id: string; name: string; phone: string; profileImage?: string };
  receiver: string | { _id: string; name: string; phone: string; profileImage?: string };
  text: string;
  status: "sent" | "delivered" | "read";
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participant1?: string | { _id: string; name: string; phone: string; profileImage?: string };
  participant2?: string | { _id: string; name: string; phone: string; profileImage?: string };
  rideId?: string | { _id: string; from: string; to: string; departureTime: string; status: string };
  otherUser?: { _id: string; name: string; phone: string; profileImage?: string };
  unreadCount?: number;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartConversationData {
  receiverId: string;
  rideId?: string;
}

export interface GetMessagesParams {
  skip?: number;
  limit?: number;
}

export interface ConversationMessagesResponse {
  conversation: {
    _id: string;
    otherUser: { _id: string; name: string; phone: string; profileImage?: string };
    ride?: { _id: string; from: string; to: string; departureTime: string; status: string };
    createdAt: string;
    updatedAt: string;
  };
  messages: Message[];
  pagination?: {
    skip: number;
    limit: number;
    total: number;
  };
}

