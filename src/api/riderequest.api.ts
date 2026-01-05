import { RideRequestService } from "../services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateRideRequestData,
  RequestSpecificRideData,
  OfferRideRequestData,
  CancelRideRequestData,
} from "../types/riderequest";

// Create ride request
export const useCreateRideRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateRideRequestData) => {
      return await RideRequestService.createRideRequest(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rideRequests", "passenger"] });
      queryClient.invalidateQueries({ queryKey: ["rideRequests", "passenger", "upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["rideRequests", "passenger", "current"] });
      queryClient.invalidateQueries({ queryKey: ["rideRequests", "driver", "open"] });
    },
  });
};

// Request specific ride
export const useRequestSpecificRideMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ rideId, data }: { rideId: string; data: RequestSpecificRideData }) => {
      return await RideRequestService.requestSpecificRide(rideId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rideRequests"] });
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
};

// Get single ride request
export const useGetRideRequestById = (id: string) => {
  return useQuery({
    queryKey: ["rideRequest", id],
    queryFn: async () => await RideRequestService.getRideRequestById(id),
    enabled: !!id,
  });
};

// Cancel ride request
export const useCancelRideRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CancelRideRequestData }) => {
      return await RideRequestService.cancelRideRequest(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rideRequests"] });
    },
  });
};

// Get all ride requests for driver
export const useGetDriverRideRequests = () => {
  return useQuery({
    queryKey: ["rideRequests", "driver", "all"],
    queryFn: async () => await RideRequestService.getDriverRideRequests(),
  });
};

// Get all ride requests for passenger
export const useGetPassengerRideRequests = () => {
  return useQuery({
    queryKey: ["rideRequests", "passenger", "all"],
    queryFn: async () => await RideRequestService.getPassengerRideRequests(),
  });
};

// Get past ride requests for passenger
export const useGetPassengerPastRideRequests = () => {
  return useQuery({
    queryKey: ["rideRequests", "passenger", "past"],
    queryFn: async () => await RideRequestService.getPassengerPastRideRequests(),
  });
};

// Get upcoming ride requests for passenger
export const useGetPassengerUpcomingRideRequests = () => {
  return useQuery({
    queryKey: ["rideRequests", "passenger", "upcoming"],
    queryFn: async () => await RideRequestService.getPassengerUpcomingRideRequests(),
  });
};

// Get current ride requests for passenger
export const useGetPassengerCurrentRideRequests = () => {
  return useQuery({
    queryKey: ["rideRequests", "passenger", "current"],
    queryFn: async () => await RideRequestService.getPassengerCurrentRideRequests(),
  });
};

// Get ride requests by ride
export const useGetRideRequestsByRide = (rideId: string) => {
  return useQuery({
    queryKey: ["rideRequests", "ride", rideId],
    queryFn: async () => await RideRequestService.getRideRequestsByRide(rideId),
    enabled: !!rideId,
  });
};

// Offer ride to request
export const useOfferRideToRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, data }: { requestId: string; data: OfferRideRequestData }) => {
      return await RideRequestService.offerRideToRequest(requestId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rideRequests"] });
      queryClient.invalidateQueries({ queryKey: ["driverOffers"] });
    },
  });
};

// Get driver offers
export const useGetDriverOffers = () => {
  return useQuery({
    queryKey: ["driverOffers"],
    queryFn: async () => await RideRequestService.getDriverOffers(),
  });
};

// Accept offer
export const useAcceptOfferMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, offerId }: { requestId: string; offerId: string }) => {
      return await RideRequestService.acceptOffer(requestId, offerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rideRequests"] });
      queryClient.invalidateQueries({ queryKey: ["driverOffers"] });
    },
  });
};

// Get open ride requests for driver
export const useGetOpenRideRequestsForDriver = () => {
  return useQuery({
    queryKey: ["rideRequests", "driver", "open"],
    queryFn: async () => await RideRequestService.getOpenRideRequestsForDriver(),
  });
};

// Get past ride requests for driver
export const useGetPastRideRequestsForDriver = () => {
  return useQuery({
    queryKey: ["rideRequests", "driver", "past"],
    queryFn: async () => await RideRequestService.getPastRideRequestsForDriver(),
  });
};

// Get upcoming ride requests for driver
export const useGetUpcomingRideRequestsForDriver = () => {
  return useQuery({
    queryKey: ["rideRequests", "driver", "upcoming"],
    queryFn: async () => await RideRequestService.getUpcomingRideRequestsForDriver(),
  });
};

