import { z } from "zod";

// Zod Schemas
export const createRideRequestSchema = z.object({
  from: z.string().min(1, "From location is required"),
  to: z.string().min(1, "To location is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  requiredSeats: z.number().int("Seats must be a whole number").min(1, "At least 1 seat is required").max(7, "Maximum 7 seats allowed"),
  approxFarePerSeat: z.number().min(0).optional(),
});

export const requestSpecificRideSchema = z.object({
  requiredSeats: z.number().int("Seats must be a whole number").min(1, "At least 1 seat is required"),
  note: z.string().optional(),
});

export const offerRideRequestSchema = z.object({
  rideId: z.string().optional(),
  availableSeats: z.number().min(1).max(7).optional(),
  vehicleId: z.string().optional(),
});

export const respondRideRequestSchema = z.object({
  accept: z.boolean(),
  rideId: z.string().optional(),
});

export const cancelRideRequestSchema = z.object({
  reason: z.string().max(500).optional(),
});

// TypeScript Types
export type CreateRideRequestFormValues = z.infer<typeof createRideRequestSchema>;
export type RequestSpecificRideFormValues = z.infer<typeof requestSpecificRideSchema>;
export type OfferRideRequestFormValues = z.infer<typeof offerRideRequestSchema>;
export type RespondRideRequestFormValues = z.infer<typeof respondRideRequestSchema>;
export type CancelRideRequestFormValues = z.infer<typeof cancelRideRequestSchema>;

export interface RideRequestOffer {
  _id: string;
  driver: string | { _id: string; name: string; phone: string; profileImage?: string };
  ride: string | { _id: string; from: string; to: string; departureTime: string; availableSeats: number; bookedSeats: number; vehicle?: any };
  status: "pending" | "accepted" | "declined" | "expired";
  createdAt: string;
  expiresAt?: string;
}

export interface RideRequest {
  _id: string;
  passenger: string | { _id: string; name: string; phone: string; profileImage?: string; averageRating?: number };
  from: string;
  to: string;
  dateTime: string;
  requiredSeats: number;
  approxFarePerSeat?: number;
  status: "open" | "matched" | "cancelled" | "declined";
  matchedDriver?: string | { _id: string; name: string; phone: string; profileImage?: string };
  matchedRide?: string | { _id: string; from: string; to: string; departureTime: string; vehicle?: any; status: string };
  offers?: RideRequestOffer[];
  passengerResponse?: "pending" | "accepted" | "declined";
  driverResponse?: "pending" | "accepted" | "declined";
  declinedBy?: "passenger" | "driver" | "system";
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRideRequestData {
  from: string;
  to: string;
  date: string;
  time: string;
  requiredSeats: number;
  approxFarePerSeat?: number;
}

export interface RequestSpecificRideData {
  requiredSeats: number;
  note?: string;
}

export interface OfferRideRequestData {
  rideId?: string;
  availableSeats?: number;
  vehicleId?: string;
}

export interface RespondRideRequestData {
  accept: boolean;
  rideId?: string;
}

export interface CancelRideRequestData {
  reason?: string;
}

