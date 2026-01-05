import { sendRequest } from "../utils/sendRequests";
import type { StartConversationData, GetMessagesParams } from "../types/conversation";

// Start or get existing conversation
export const startConversation = async (data: StartConversationData) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/conversations/start",
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Conversation Service [startConversation] error: ${error}`);
    throw error;
  }
};

// Get all conversations for current user
export const getMyConversations = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/conversations",
    });
    return response.data.data;
  } catch (error) {
    console.log(`Conversation Service [getMyConversations] error: ${error}`);
    throw error;
  }
};

// Get messages for a conversation
export const getConversationMessages = async (conversationId: string, params?: GetMessagesParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    const url = queryParams.toString() ? `/conversations/${conversationId}/messages?${queryParams.toString()}` : `/conversations/${conversationId}/messages`;
    
    const response = await sendRequest({
      method: "GET",
      url,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Conversation Service [getConversationMessages] error: ${error}`);
    throw error;
  }
};

// Delete a single message
export const deleteMessage = async (conversationId: string, messageId: string) => {
  try {
    const response = await sendRequest({
      method: "DELETE",
      url: `/conversations/${conversationId}/messages/${messageId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Conversation Service [deleteMessage] error: ${error}`);
    throw error;
  }
};

// Delete a whole conversation/thread
export const deleteConversation = async (conversationId: string) => {
  try {
    const response = await sendRequest({
      method: "DELETE",
      url: `/conversations/${conversationId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Conversation Service [deleteConversation] error: ${error}`);
    throw error;
  }
};

