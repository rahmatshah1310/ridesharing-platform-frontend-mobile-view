import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { MessageSquare, ArrowLeft, User, MapPin, AlertCircle, Trash2 } from "lucide-react";
import { useGetMyConversations, useDeleteConversationMutation } from "../../api/api";
import { ROUTES } from "../../constants/routes";
import type { Conversation } from "../../types/conversation";
import { ConfirmDialog } from "../../components/components";
import { toast } from "react-toastify";

const Conversations: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const { data: conversations, isLoading, error } = useGetMyConversations();
  console.log(conversations,"=====================>")
  const deleteConversationMutation = useDeleteConversationMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const conversationsArray = Array.isArray(conversations) ? conversations : conversations ? [conversations] : [];

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  const errorMessage = error ? (typeof error === "string" ? error : String(error)) : null;

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation(); 
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteConversation = () => {
    if (!conversationToDelete) return;

    deleteConversationMutation.mutate(conversationToDelete, {
      onSuccess: () => {
        toast.success("Conversation deleted successfully");
        setConversationToDelete(null);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete conversation");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.home)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your conversations</p>
          </div>
        </div>

        {/* Error State */}
        {error && !isLoading && (
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardContent className="py-8 text-center">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Conversations</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">{errorMessage || "An error occurred while loading conversations. Please try again later."}</p>
            </CardContent>
          </Card>
        )}

        {/* Conversations List */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading conversations...</p>
            </CardContent>
          </Card>
        ) : error ? null : conversationsArray.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Conversations</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any conversations yet. Start chatting with drivers or passengers!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {conversationsArray.map((conversation: Conversation) => {
              const otherUser =
                conversation.otherUser || (typeof conversation.participant1 === "object" && conversation.participant1._id === userData?._id ? conversation.participant2 : conversation.participant1);
              const unreadCount = conversation.unreadCount || 0;

              return (
                <Card key={conversation._id} className="cursor-pointer hover:shadow-lg transition-shadow group" onClick={() => navigate(`${ROUTES.messages.chat}/${conversation._id}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      {typeof otherUser === "object" && otherUser.profileImage ? (
                        <img src={otherUser.profileImage} alt={otherUser.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{typeof otherUser === "object" ? otherUser.name : "Unknown User"}</h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{formatDate(conversation.lastMessageAt)}</span>
                        </div>
                        {conversation.rideId && typeof conversation.rideId === "object" && (
                          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                              {conversation.rideId.from} → {conversation.rideId.to}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Unread Badge */}
                        {unreadCount > 0 && (
                          <div className="flex-shrink-0">
                            <span className="bg-blue-600 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">{unreadCount > 9 ? "9+" : unreadCount}</span>
                          </div>
                        )}
                        {/* Delete Button */}
                        <button
                          onClick={(e) => handleDeleteConversation(e, conversation._id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-600 dark:text-red-400"
                          title="Delete conversation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Conversation Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? All messages will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDeleteConversation}
        isLoading={deleteConversationMutation.isPending}
      />
    </div>
  );
};

export default Conversations;
