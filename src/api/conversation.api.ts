import { ConversationService } from "../services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StartConversationData, GetMessagesParams } from "../types/conversation";

export const useStartConversationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: StartConversationData) => {
      return await ConversationService.startConversation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// Get all conversations for current user
export const useGetMyConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => await ConversationService.getMyConversations(),
  });
};

// Get messages for a conversation
export const useGetConversationMessages = (conversationId: string, params?: GetMessagesParams) => {
  return useQuery({
    queryKey: ["conversation", conversationId, "messages", params],
    queryFn: async () => await ConversationService.getConversationMessages(conversationId, params),
    enabled: !!conversationId,
  });
};

// Delete a single message
export const useDeleteMessageMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
      return await ConversationService.deleteMessage(conversationId, messageId);
    },
    onSuccess: (_, variables) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({ queryKey: ["conversation", variables.conversationId, "messages"] });
      // Invalidate conversations list to update lastMessageAt
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// Delete a whole conversation/thread
export const useDeleteConversationMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (conversationId: string) => {
      return await ConversationService.deleteConversation(conversationId);
    },
    onSuccess: (_, conversationId) => {
      // Remove conversation from cache
      queryClient.removeQueries({ queryKey: ["conversation", conversationId] });
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

