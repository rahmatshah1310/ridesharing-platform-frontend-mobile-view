import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./UserContext";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import type {
  RideNewEventData,
  RideCancelledEventData,
  RideStatusUpdatedEventData,
  RideRequestNewEventData,
  RideRequestSpecificEventData,
  RideRequestOfferedEventData,
  RideRequestOfferAcceptedEventData,
  RideRequestCancelledEventData,
  RideRequestDriverResponseEventData,
  RideRequestPassengerResponseEventData,
  RideRequestUpdateEventData,
  ReceiveMessageEventData,
  ConversationReadEventData,
  UserTypingEventData,
  UserOnlineEventData,
  UserOfflineEventData,
  MessageDeletedEventData,
  ConversationDeletedEventData,
  DriverApprovedEventData,
  DriverRejectedEventData,
  DriverReverificationRequiredEventData,
  AdminDriverApprovedEventData,
  AdminDriverRejectedEventData,
  AdminDriverUpdatedSensitiveEventData,
  SocketErrorEventData,
  SocketEmitResponse,
} from "../types/socketEvents";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (
    conversationId: string,
    message: string,
    receiverId: string,
  ) => void;
  markMessageAsRead: (messageId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  sendTypingIndicator: (
    receiverId: string,
    threadId: string,
    isTyping: boolean,
  ) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => {},
  markMessageAsRead: () => {},
  markConversationAsRead: () => {},
  sendTypingIndicator: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, userData } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !userData) {
      // Disconnect if no token/user
      if (socketRef.current) {
        socketRef.current.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Get socket URL from environment or use API URL
    // Socket typically runs on the same server as the API
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const socketUrl = import.meta.env.VITE_SOCKET_URL || apiUrl;

    // Ensure we have a valid URL (remove trailing slash if present, and ensure no path)
    let cleanSocketUrl = socketUrl.replace(/\/$/, "");
    // Remove any path after the domain (socket.io uses root namespace by default)
    try {
      const url = new URL(cleanSocketUrl);
      cleanSocketUrl = `${url.protocol}//${url.host}`;
    } catch (e) {
      // If URL parsing fails, use as-is
      console.warn("Could not parse socket URL:", cleanSocketUrl);
    }

    console.log("Connecting to socket:", cleanSocketUrl);

    // Create socket connection
    const newSocket = io(cleanSocketUrl, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      autoConnect: true,
    });
    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection events
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    // (listeners are attached per-socket instance; cleanup happens in the effect cleanup)

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setIsConnected(false);
      // Only show for persistent errors
      if (error.message.includes("Invalid namespace")) {
        console.error(
          "Socket namespace error - check if socket server is running on:",
          cleanSocketUrl,
        );
      }
    });

    // ========== RIDE EVENTS ==========
    // New ride created (for passengers)
    newSocket.on("ride:new", (data: RideNewEventData) => {
      toast.info(`New ride available: ${data.from} → ${data.to}`);
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({
        queryKey: ["passengerRides", "upcoming"],
      });
    });

    // Ride cancelled
    newSocket.on("ride:cancelled", (data: RideCancelledEventData) => {
      toast.warning(
        `Ride cancelled: ${data.cancellationReason || "No reason provided"}`,
      );
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({ queryKey: ["ride", data.id] });
      queryClient.invalidateQueries({ queryKey: ["driverRides"] });
    });

    // Ride status updated
    newSocket.on("ride:status:updated", (data: RideStatusUpdatedEventData) => {
      toast.info(`Ride status updated: ${data.status}`);
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({ queryKey: ["ride", data.id] });
      queryClient.invalidateQueries({ queryKey: ["driverRides"] });
    });

    // ========== RIDE REQUEST EVENTS ==========
    // New ride request (for drivers)
    newSocket.on("ride:request:new", (data: RideRequestNewEventData) => {
      toast.info(`New ride request: ${data.from} → ${data.to}`);
      queryClient.invalidateQueries({
        queryKey: ["rideRequests", "driver", "open"],
      });
    });

    // Ride request for specific ride (for driver)
    newSocket.on(
      "ride:request:specific",
      (_data: RideRequestSpecificEventData) => {
        toast.info(`Someone requested a seat on your ride`);
        queryClient.invalidateQueries({ queryKey: ["rideRequests"] });
        queryClient.invalidateQueries({ queryKey: ["rides"] });
      },
    );

    // Driver offered a ride to request (for passenger)
    newSocket.on(
      "ride:request:offered",
      (data: RideRequestOfferedEventData) => {
        toast.success(`Driver offered a ride for your request`);
        queryClient.invalidateQueries({ queryKey: ["rideRequests"] });
        queryClient.invalidateQueries({
          queryKey: ["rideRequest", data.requestId],
        });
      },
    );

    // Offer accepted (for driver)
    newSocket.on(
      "ride:request:offerAccepted",
      (_data: RideRequestOfferAcceptedEventData) => {
        toast.success(`Your offer was accepted!`);
        queryClient.invalidateQueries({ queryKey: ["rideRequests"] });
        queryClient.invalidateQueries({ queryKey: ["driverOffers"] });
        queryClient.invalidateQueries({ queryKey: ["rides"] });
      },
    );

    // Ride request cancelled
    newSocket.on(
      "ride:request:cancelled",
      (_data: RideRequestCancelledEventData) => {
        toast.warning(`Ride request cancelled`);
        queryClient.invalidateQueries({ queryKey: ["rideRequests"] });
      },
    );

    // Driver response to ride request (for passenger)
    newSocket.on(
      "ride:request:driverResponse",
      (data: RideRequestDriverResponseEventData) => {
        if (data.accept) {
          toast.success(`Driver accepted your ride request!`);
        } else {
          toast.info(`Driver declined your ride request`);
        }
        queryClient.invalidateQueries({ queryKey: ["rideRequests"] });
        queryClient.invalidateQueries({ queryKey: ["rideRequest", data.id] });
      },
    );

    // Passenger response to ride request (for driver)
    newSocket.on(
      "ride:request:passengerResponse",
      (data: RideRequestPassengerResponseEventData) => {
        if (data.accept) {
          toast.success(`Passenger accepted your ride request!`);
        } else {
          toast.info(`Passenger declined your ride request`);
        }
        queryClient.invalidateQueries({ queryKey: ["rideRequests"] });
        queryClient.invalidateQueries({ queryKey: ["rideRequest", data.id] });
      },
    );

    // Ride request update
    newSocket.on("ride:request:update", (data: RideRequestUpdateEventData) => {
      toast.info(`Ride request updated`);
      queryClient.invalidateQueries({ queryKey: ["rideRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["rideRequest", data.requestId || data.id],
      });
    });

    // ========== MESSAGE EVENTS ==========
    // Receive new message
    newSocket.on("receiveMessage", (data: ReceiveMessageEventData) => {
      toast.info(`New message from ${data.senderName}`);
      queryClient.invalidateQueries({
        queryKey: ["conversation", data.conversation, "messages"],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    // Message read receipt
    // newSocket.on("messageRead", (data: any) => {
    //   console.log("Message read:", data);
    //   // Invalidate both conversation messages and conversations list to update unreadCount
    //   queryClient.invalidateQueries({ queryKey: ["conversation"] });
    //   queryClient.invalidateQueries({ queryKey: ["conversations"] });
    // });

    newSocket.on("conversationRead", (data: ConversationReadEventData) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      // Optional: if you're on that conversation screen, refresh messages too
      if (data?.thread_id) {
        queryClient.invalidateQueries({
          queryKey: ["conversation", data.thread_id, "messages"],
        });
      }
    });

    // User typing indicator
    newSocket.on("userTyping", (data: UserTypingEventData) => {
      console.log("User typing:", data);
      // Handle typing indicator in chat component
    });

    // User online/offline
    newSocket.on("userOnline", (data: UserOnlineEventData) => {
      console.log("User online:", data);
      // Could update user status in UI if needed
    });

    newSocket.on("userOffline", (data: UserOfflineEventData) => {
      console.log("User offline:", data);
      // Could update user status in UI if needed
    });

    // Message deleted
    newSocket.on("message:deleted", (data: MessageDeletedEventData) => {
      // Invalidate conversation messages and conversations list
      queryClient.invalidateQueries({
        queryKey: ["conversation", data.conversationId, "messages"],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    // Conversation deleted
    newSocket.on(
      "conversation:deleted",
      (data: ConversationDeletedEventData) => {
        // Remove conversation from cache
        queryClient.removeQueries({
          queryKey: ["conversation", data.conversationId],
        });
        // Invalidate conversations list
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    );

    // ========== DRIVER APPROVAL EVENTS ==========
    newSocket.on("driver:approved", (_data: DriverApprovedEventData) => {
      toast.success("Your driver account has been approved!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    });

    newSocket.on("driver:rejected", (_data: DriverRejectedEventData) => {
      toast.error(
        "Your driver account application was rejected. Please contact support.",
      );
      queryClient.invalidateQueries({ queryKey: ["user"] });
    });

    newSocket.on(
      "driver:reverification:required",
      (_data: DriverReverificationRequiredEventData) => {
        toast.warning(
          "Driver reverification required. Please update your information.",
        );
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
    );

    // ========== ADMIN EVENTS (for admin users) ==========
    newSocket.on(
      "admin:driver:approved",
      (data: AdminDriverApprovedEventData) => {
        console.log("Admin: Driver approved:", data);
        // Admin notification - could show in admin panel
      },
    );

    newSocket.on(
      "admin:driver:rejected",
      (data: AdminDriverRejectedEventData) => {
        console.log("Admin: Driver rejected:", data);
        // Admin notification - could show in admin panel
      },
    );

    newSocket.on(
      "admin:driver:updated-sensitive",
      (data: AdminDriverUpdatedSensitiveEventData) => {
        console.log("Admin: Driver sensitive info updated:", data);
        // Admin notification - could show in admin panel
      },
    );

    // ========== ERROR HANDLING ==========
    newSocket.on("error", (data: SocketErrorEventData) => {
      console.error("Socket error:", data);
      toast.error(data.message || "An error occurred");
    });

    // Cleanup on unmount
    return () => {
      if (newSocket && newSocket.connected) {
        newSocket.disconnect();
      }
      setSocket(null);
      setIsConnected(false);
    };
  }, [token, userData?._id, queryClient]);

  const sendMessage = (
    conversationId: string,
    message: string,
    receiverId: string,
  ) => {
    if (!socket || !isConnected) {
      toast.error("Not connected to server");
      return;
    }

    socket.emit(
      "sendMessage",
      {
        thread_id: conversationId,
        receiver_id: receiverId,
        message: message.trim(),
      },
      (response: SocketEmitResponse) => {
        if (response?.status === "error") {
          toast.error(response.message || "Failed to send message");
        }
      },
    );
  };

  // const markMessageAsRead = (id: string) => {
  //   if (!socket || !isConnected) return;

  // socket.emit("markConversationAsRead", { thread_id: id });
  // };

  const markMessageAsRead = (messageId: string) => {
    if (!socket || !isConnected) return;
    // Backend event name may vary; this keeps Chat.tsx functional and avoids undefined calls.
    socket.emit("markMessageAsRead", { message_id: messageId });
  };

  const markConversationAsRead = (conversationId: string) => {
    if (!socket || !isConnected) return;

    // Optimistically drop unread count in UI immediately (server will be source of truth on next fetch)
    queryClient.setQueryData(["conversations"], (old: any) => {
      if (!old) return old;
      const normalize = (conv: any) =>
        conv?._id === conversationId ? { ...conv, unreadCount: 0 } : conv;

      if (Array.isArray(old)) return old.map(normalize);
      // Some screens wrap single conversation as an object
      return normalize(old);
    });

    socket.emit("markConversationAsRead", { thread_id: conversationId });
    // Backup refresh in case server calculates additional fields
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  };

  const sendTypingIndicator = (
    receiverId: string,
    threadId: string,
    isTyping: boolean,
  ) => {
    if (!socket || !isConnected) return;

    socket.emit("typing", {
      recipient_id: receiverId,
      thread_id: threadId,
      is_typing: isTyping,
    });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        sendMessage,
        markMessageAsRead,
        markConversationAsRead,
        sendTypingIndicator,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};
