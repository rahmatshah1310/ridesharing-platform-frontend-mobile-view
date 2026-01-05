export type SignupPayload = {
    name: string;
    phone: string;
    role: string;
    profileImage: string; // Cloudinary URL
    cnic: string;
    city: string;
    district: string;
    country: string;
  };