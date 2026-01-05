import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z
      .string()
      .min(10, "Phone must be at least 10 digits")
      .regex(/^\d+$/, "Phone must contain only digits"),
    role: z.string().min(2, "Role is required"),
    cnic: z
      .string()
      .min(13, "CNIC must be 13 digits")
      .max(13, "CNIC must be 13 digits")
      .regex(/^\d+$/, "CNIC must contain only digits"),
    city: z.string().min(2, "City is required"),
    district: z.string().min(2, "District is required"),
    country: z.string().min(2, "Country is required"),
    profileImage: z
      .any()
      .refine((file) => file instanceof File, "Profile image is required")
      .refine((file) => file?.size <= 5 * 1024 * 1024, "Max file size is 5MB")
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file?.type),
        "Only JPG, PNG, or WEBP images are allowed"
      ),
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
    phone: z
      .string()
      .min(10, "Phone must be at least 10 digits")
      .regex(/^\d+$/, "Phone must contain only digits"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;



export const registerDriverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\d+$/, "Phone must contain only digits"),
  role: z.string().min(2, "Role is required"),
  cnic: z
    .string()
    .min(13, "CNIC must be 13 digits")
    .max(13, "CNIC must be 13 digits")
    .regex(/^\d+$/, "CNIC must contain only digits"),
  profileImage: z
    .any()
    .refine((file) => file instanceof File, "Profile image is required")
    .refine((file) => file?.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file?.type),
      "Only JPG, PNG, or WEBP images are allowed"
    ),
    carImages: z
    .array(z.any())
    .min(1, "Please upload at least 1 car image")
    .max(3, "You can upload maximum 3 car images")
    .refine((files) => files.every((f) => f instanceof File), "All items must be files")
    .refine((files) => files.every((f) => f.size <= 5 * 1024 * 1024), "Max file size is 5MB")
    .refine(
      (files) => files.every((f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type)),
      "Only JPG, PNG, or WEBP images are allowed"
    ),  
  carName: z.string().min(2, "Car name must be at least 2 characters"),
  carType: z.string().min(2, "Car type must be at least 2 characters"),
  licenseNumber: z.string().min(2, "License number must be at least 2 characters"),
  carNumberPlate: z.string().min(2, "Car number plate must be at least 2 characters"),
  vehicleColor: z.string().min(2, "Vehicle color must be at least 2 characters"),
  vehicleSeats: z
    .number()
    .int("Seats must be a whole number")
    .min(1, "Seats must be at least 1")
    .max(20, "Seats seems too high"),
});


export type RegisterDriverFormValues = z.infer<typeof registerDriverSchema>;


export const loginDriverSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\d+$/, "Phone must contain only digits"),
});

export type LoginDriverFormValues = z.infer<typeof loginDriverSchema>;