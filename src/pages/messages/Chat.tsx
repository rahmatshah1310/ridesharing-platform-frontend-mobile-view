import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useSocket } from "../../context/SocketContext";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CommonInput } from "../../components/components";
import { ArrowLeft, Send, User, MapPin, Calendar, Trash2 } from "lucide-react";
import { useGetConversationMessages, useDeleteMessageMutation } from "../../api/api";
import { ROUTES } from "../../constants/routes";
import type { Message, ConversationMessagesResponse } from "../../types/conversation";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "../../components/components";
import { toast } from "react-toastify";

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData } = useUser();
  const { socket, isConnected, sendMessage: sendSocketMessage, markMessageAsRead, sendTypingIndicator } = useSocket();
  const { data: conversationData, isLoading } = useGetConversationMessages(id || "");
  const queryClient = useQueryClient();
  const deleteMessageMutation = useDeleteMessageMutation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevMessagesLengthRef = useRef<number>(0);
  const shouldAutoScrollRef = useRef<boolean>(true);

  const conversationDataTyped = conversationData as ConversationMessagesResponse | undefined;
  const conversation = conversationDataTyped?.conversation;
  const otherUser = conversation?.otherUser;
  const receiverId = typeof otherUser === "object" ? otherUser._id : otherUser;

  // Load initial messages and invalidate conversations to update unread count
  useEffect(() => {
    if (conversationDataTyped?.messages) {
      setMessages(conversationDataTyped.messages);
      // Backend automatically marks messages as read when fetching, so refresh conversations list
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      // Scroll to bottom on initial load
      shouldAutoScrollRef.current = true;
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 100);
    }
  }, [conversationDataTyped, queryClient]);

  // Check if user is near the bottom of the scroll container
  const isNearBottom = () => {
    if (!messagesContainerRef.current) return true;
    const container = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  // Scroll to bottom only when new messages arrive and user is at/near bottom
  useEffect(() => {
    const hasNewMessages = messages.length > prevMessagesLengthRef.current;
    const wasAtBottom = shouldAutoScrollRef.current || isNearBottom();

    if (hasNewMessages && wasAtBottom) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        shouldAutoScrollRef.current = true;
      }, 100);
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  // Track scroll position to determine if user manually scrolled up
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom = isNearBottom();
      shouldAutoScrollRef.current = isAtBottom;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for new messages
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleReceiveMessage = (data: Message) => {
      if (data.conversation === id) {
        setMessages((prev) => {
          // Check if message already exists (avoid duplicates)
          const exists = prev.some((msg) => msg._id === data._id);
          if (exists) return prev;
          return [...prev, data];
        });
        // Mark as read if it's for current user
        const receiverId = typeof data.receiver === "object" ? data.receiver._id : data.receiver;
        if (String(receiverId) === String(userData?._id)) {
          markMessageAsRead(data._id);
        }
      }
    };

    const handleUserTyping = (data: { user_id: string; conversation: string; is_typing: boolean }) => {
      if (data.conversation === id && data.user_id !== userData?._id) {
        setOtherUserTyping(data.is_typing);
        // Auto-hide typing indicator after 3 seconds
        if (data.is_typing) {
          setTimeout(() => setOtherUserTyping(false), 3000);
        }
      }
    };

    const handleMessageRead = (data: { message_id: string; read_by: string; read_at: Date }) => {
      // Update message status to "read" if it's our message
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg._id === data.message_id) {
            const msgSenderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
            if (String(msgSenderId) === String(userData?._id)) {
              return { ...msg, status: "read" as const };
            }
          }
          return msg;
        })
      );
      // Invalidate conversations to update unreadCount immediately
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    const handleMessageDeleted = (data: { messageId: string; conversationId: string; deletedBy: string; deletedAt: Date }) => {
      if (data.conversationId === id) {
        setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
        // Invalidate to refresh conversation data
        queryClient.invalidateQueries({ queryKey: ["conversation", id, "messages"] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("messageRead", handleMessageRead);
    socket.on("message:deleted", handleMessageDeleted);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("messageRead", handleMessageRead);
      socket.off("message:deleted", handleMessageDeleted);
    };
  }, [socket, isConnected, id, userData?._id, markMessageAsRead, queryClient]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (messages.length > 0 && receiverId && id && userData?._id) {
      let hasUnread = false;
      const unreadMessages: string[] = [];

      messages.forEach((msg) => {
        const receiverIdStr = typeof msg.receiver === "object" ? msg.receiver._id : msg.receiver;
        if (String(receiverIdStr) === String(userData._id) && msg.status !== "read") {
          markMessageAsRead(msg._id);
          unreadMessages.push(msg._id);
          hasUnread = true;
        }
      });

      // Always invalidate conversations to update unreadCount after marking messages as read
      // The backend resets unread count when messages are fetched, so we need to refresh
      if (hasUnread) {
        // Small delay to allow backend to process the markAsRead events
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }, 500);
      }
    }
  }, [messages, receiverId, userData?._id, markMessageAsRead, id, queryClient]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !id || !receiverId) return;

    sendSocketMessage(id, message, receiverId);
    setMessage("");
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Scroll to bottom when sending a message
    shouldAutoScrollRef.current = true;
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator(id || "", true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(id || "", false);
    }, 1000);
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteMessage = () => {
    if (!messageToDelete || !id) return;

    deleteMessageMutation.mutate(
      { conversationId: id, messageId: messageToDelete },
      {
        onSuccess: () => {
          toast.success("Message deleted successfully");
          setMessages((prev) => prev.filter((msg) => msg._id !== messageToDelete));
          setMessageToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to delete message");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">Conversation not found</p>
            <Button onClick={() => navigate(ROUTES.messages.list)} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.messages.list)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            {typeof otherUser === "object" && otherUser.profileImage ? (
              <img src={otherUser.profileImage} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{typeof otherUser === "object" ? otherUser.name : "Unknown User"}</h2>
              {!isConnected && <p className="text-xs text-gray-500 dark:text-gray-400">Connecting...</p>}
              {isConnected && <p className="text-xs text-green-500">Online</p>}
            </div>
          </div>
        </div>
        {conversation.ride && typeof conversation.ride === "object" && (
          <div className="max-w-4xl mx-auto mt-2 px-4 pb-2">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>
                {conversation.ride.from} → {conversation.ride.to}
              </span>
              <Calendar className="w-3 h-3 ml-2" />
              <span>{new Date(conversation.ride.departureTime).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Messages - Scrollable Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => {
            // Determine if this message is from the current user
            const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
            const currentUserId = userData?._id;
            // Convert both to strings for reliable comparison
            const isOwnMessage = String(senderId) === String(currentUserId);

            // Get sender name
            let senderName: string;
            if (isOwnMessage) {
              // Sent message - show "You" (your own message)
              senderName = "You";
            } else {
              // Received message - show sender's name (the person who sent it to you)
              if (typeof msg.sender === "object" && msg.sender.name) {
                senderName = msg.sender.name;
              } else if (typeof otherUser === "object" && otherUser.name) {
                // Fallback to otherUser if sender is just an ID (should be the person you're chatting with)
                senderName = otherUser.name;
              } else {
                senderName = "Unknown";
              }
            }

            return (
              <div key={msg._id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} group`}>
                <div className={`relative max-w-xs md:max-w-md px-4 py-2 rounded-lg ${isOwnMessage ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"}`}>
                  {/* Show sender name for all messages */}
                  <p className={`text-xs font-semibold mb-1 ${isOwnMessage ? "opacity-80" : "opacity-70"}`}>{senderName}</p>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${isOwnMessage ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                    {formatTime(msg.createdAt)}
                    {isOwnMessage && msg.status === "read" && <span className="ml-1">✓✓</span>}
                    {isOwnMessage && msg.status === "delivered" && <span className="ml-1">✓</span>}
                  </p>
                  {isOwnMessage && (
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg"
                      title="Delete message"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {otherUserTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input - Fixed at Bottom */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
          <CommonInput value={message} onChange={(e) => handleTyping(e.target.value)} placeholder="Type a message..." className="flex-1 bg-gray-50 dark:bg-gray-700" disabled={!isConnected} />
          <Button type="submit" disabled={!message.trim() || !isConnected}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Delete Message Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDeleteMessage}
        isLoading={deleteMessageMutation.isPending}
      />
    </div>
  );
};

export default Chat;
