import z from "zod";

export interface CreateRideData {
  from: string;
  to: string;
  date: string;
  time: string;
  availableSeats: number;
  status?: string;
}

export interface UpdateRideData {
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  availableSeats?: number;
  status?: string;
}

export interface CancelRideData {
  reason: string;
}

export interface RatingData {
  score: number;
  comment?: string;
  feedbackTags?: string[];
}

export interface UpdateRideStatusData {
  status: string;
}

export interface GetRidesParams {
  status?: string;
}

// Validation schemas
export const createRideSchema = z.object({
  from: z.string().min(1, "From location is required"),
  to: z.string().min(1, "To location is required"),
  date: z.string().min(1, "Date is required"),
  time: z
    .string()
    .min(1, "Time is required")
    .regex(
      /^(?:((0?[1-9])|(1[0-2])):[0-5]\d\s?(AM|PM))$/i,
      'Time must be in "hh:mm AM/PM" format (e.g., 9:30 PM)',
    ),
  availableSeats: z
    .number()
    .int("Seats must be a whole number")
    .min(1, "At least 1 seat is required")
    .max(7, "Maximum 7 seats allowed"),
  status: z
    .enum(["scheduled", "in_progress", "completed", "cancelled"])
    .optional(),
});

export type CreateRideFormValues = z.infer<typeof createRideSchema>;

export const updateRideSchema = z.object({
  from: z.string().min(1).optional(),
  to: z.string().min(1).optional(),
  date: z.string().optional(),
  time: z
    .string()
    .regex(
      /^(?:((0?[1-9])|(1[0-2])):[0-5]\d\s?(AM|PM))$/i,
      'Time must be in "hh:mm AM/PM" format',
    )
    .optional(),
  availableSeats: z.number().int().min(1).max(7).optional(),
  status: z
    .enum(["scheduled", "in_progress", "completed", "cancelled"])
    .optional(),
});

export type UpdateRideFormValues = z.infer<typeof updateRideSchema>;

export const cancelRideSchema = z.object({
  reason: z
    .string()
    .max(500, "Reason must be at most 500 characters")
    .optional(),
});

export type CancelRideFormValues = z.infer<typeof cancelRideSchema>;

export const updateRideStatusSchema = z.object({
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]),
});

export type UpdateRideStatusFormValues = z.infer<typeof updateRideStatusSchema>;
