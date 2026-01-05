export interface PassengerProfile {
  cnic?: string;
  city?: string;
  district?: string;
  country?: string;
  isComplete: boolean;
}

export interface DriverProfile {
  cnic?: string;
  licenseNumber?: string;
  isComplete: boolean;
  isVerified: boolean;
  appliedAt?: string;
  vehicleColor?: string;
  carImages?: string[];
  approvedAt?: string;
  verificationStatus?: "pending" | "approved" | "rejected";
  ratingAverage?: number;
  ratingCount?: number;
}

export interface Vehicle {
  _id: string;
  carImages: string[];
  carName: string;
  carType: string;
  numberPlate: string;
  seats: number;
  status: "active" | "inactive";
  driver: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  phone: string;
  role: "passenger" | "driver";
  status: "active" | "blocked";
  isVerified: boolean;
  profileImage: string | null;
  passengerProfile?: PassengerProfile;
  driverProfile?: DriverProfile;
  isDriverApproved: boolean;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
  currentMode?: "passenger" | "driver";
  socket_id?: string | null;
  is_online?: boolean;
  suspendedAt?: string;
  suspensionReason?: string;
  activeVehicle?: Vehicle;
  vehicles?: Vehicle[];
}

