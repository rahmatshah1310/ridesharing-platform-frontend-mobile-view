// Socket event data types for better type safety

// ========== RIDE EVENTS ==========
export interface RideNewEventData {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  availableSeats: number;
  driver?: {
    _id: string;
    name: string;
    phone: string;
    profileImage?: string;
  };
}

export interface RideCancelledEventData {
  id: string;
  cancellationReason?: string;
  cancelledBy?: string;
}

export interface RideStatusUpdatedEventData {
  id: string;
  status: string;
  previousStatus?: string;
}

// ========== RIDE REQUEST EVENTS ==========
export interface RideRequestNewEventData {
  id: string;
  from: string;
  to: string;
  dateTime: string;
  requiredSeats: number;
  passenger?: {
    _id: string;
    name: string;
    phone: string;
    profileImage?: string;
  };
}

export interface RideRequestSpecificEventData {
  id: string;
  rideId: string;
  requiredSeats: number;
  passenger?: {
    _id: string;
    name: string;
    phone: string;
    profileImage?: string;
  };
}

export interface RideRequestOfferedEventData {
  requestId: string;
  rideId: string;
  driver?: {
    _id: string;
    name: string;
    phone: string;
    profileImage?: string;
  };
}

export interface RideRequestOfferAcceptedEventData {
  requestId: string;
  rideId: string;
  passenger?: {
    _id: string;
    name: string;
    phone: string;
    profileImage?: string;
  };
  driver?: {
    _id: string;
    name: string;
    phone: string;
    profileImage?: string;
  };
}

export interface RideRequestCancelledEventData {
  id: string;
  cancellationReason?: string;
  cancelledBy?: string;
}

export interface RideRequestDriverResponseEventData {
  id: string;
  accept: boolean;
  driver?: {
    _id: string;
    name: string;
    phone: string;
    profileImage?: string;
  };
}

export interface RideRequestPassengerResponseEventData {
  id: string;
  accept: boolean;
  passenger?: {
    _id: string;
    name: string;
    phone: string;
    profileImage?: string;
  };
}

export interface RideRequestUpdateEventData {
  id?: string;
  requestId?: string;
  status?: string;
  updatedFields?: Record<string, any>;
}

// ========== MESSAGE EVENTS ==========
export interface ReceiveMessageEventData {
  conversation: string;
  senderName: string;
  message: string;
  sender: string;
  timestamp?: string;
}

export interface ConversationReadEventData {
  thread_id?: string;
  conversationId?: string;
  userId?: string;
}

export interface UserTypingEventData {
  userId: string;
  threadId: string;
  isTyping: boolean;
}

export interface UserOnlineEventData {
  userId: string;
  timestamp?: string;
}

export interface UserOfflineEventData {
  userId: string;
  timestamp?: string;
}

export interface MessageDeletedEventData {
  conversationId: string;
  messageId: string;
  deletedBy?: string;
}

export interface ConversationDeletedEventData {
  conversationId: string;
  deletedBy?: string;
}

// ========== DRIVER APPROVAL EVENTS ==========
export interface DriverApprovedEventData {
  driverId: string;
  approvedBy?: string;
  timestamp?: string;
}

export interface DriverRejectedEventData {
  driverId: string;
  reason?: string;
  rejectedBy?: string;
  timestamp?: string;
}

export interface DriverReverificationRequiredEventData {
  driverId: string;
  reason?: string;
  requiredFields?: string[];
  timestamp?: string;
}

// ========== ADMIN EVENTS ==========
export interface AdminDriverApprovedEventData {
  driverId: string;
  approvedBy: string;
  timestamp?: string;
}

export interface AdminDriverRejectedEventData {
  driverId: string;
  reason?: string;
  rejectedBy: string;
  timestamp?: string;
}

export interface AdminDriverUpdatedSensitiveEventData {
  driverId: string;
  updatedFields: string[];
  updatedBy: string;
  timestamp?: string;
}

// ========== ERROR HANDLING ==========
export interface SocketErrorEventData {
  message?: string;
  code?: string;
  details?: any;
}

// ========== SOCKET EMIT RESPONSE TYPES ==========
export interface SocketEmitResponse {
  status: "success" | "error";
  message?: string;
  data?: any;
}
