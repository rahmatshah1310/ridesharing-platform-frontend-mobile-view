import { RidesService } from "../services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateRideData,
  UpdateRideData,
  CancelRideData,
  UpdateRideStatusData,
  GetRidesParams,
  RatingData,
} from "../types/rides";

// Create a new ride
export const useCreateRideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRideData) => {
      return await RidesService.createRide(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({ queryKey: ["driverRides"] });
    },
  });
};

// Get all rides with optional status filter
export const useGetRides = (params?: GetRidesParams) => {
  return useQuery({
    queryKey: ["rides", params],
    queryFn: async () => await RidesService.getRides(params),
  });
};

// Get a single ride by ID
export const useGetRideById = (id: string) => {
  return useQuery({
    queryKey: ["ride", id],
    queryFn: async () => await RidesService.getRideById(id),
    enabled: !!id,
  });
};

// Update a ride
export const useUpdateRideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRideData }) => {
      return await RidesService.updateRide(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ride", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({ queryKey: ["driverRides"] });
    },
  });
};

// Delete a ride
export const useDeleteRideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await RidesService.deleteRide(id);
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["ride", id] });
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({ queryKey: ["driverRides"] });
    },
  });
};

// Cancel a ride
export const useCancelRideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CancelRideData }) => {
      return await RidesService.cancelRide(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ride", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({ queryKey: ["driverRides"] });
    },
  });
};

// Update ride status
export const useUpdateRideStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRideStatusData;
    }) => {
      return await RidesService.updateRideStatus(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ride", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({ queryKey: ["driverRides"] });
    },
  });
};

// Get all rides for the current driver
export const useGetDriverRides = () => {
  return useQuery({
    queryKey: ["driverRides", "all"],
    queryFn: async () => await RidesService.getDriverRides(),
  });
};

// Get current ride for the current driver
export const useGetDriverCurrentRide = () => {
  return useQuery({
    queryKey: ["driverRides", "current"],
    queryFn: async () => await RidesService.getDriverCurrentRide(),
  });
};

// Get past rides for the current driver
export const useGetDriverPastRides = () => {
  return useQuery({
    queryKey: ["driverRides", "past"],
    queryFn: async () => await RidesService.getDriverPastRides(),
  });
};

// Get upcoming rides for the current driver
export const useGetDriverUpcomingRides = () => {
  return useQuery({
    queryKey: ["driverRides", "upcoming"],
    queryFn: async () => await RidesService.getDriverUpcomingRides(),
  });
};

// Get upcoming rides for passenger
export const useGetPassengerUpcomingRides = () => {
  return useQuery({
    queryKey: ["passengerRides", "upcoming"],
    queryFn: async () => await RidesService.getPassengerUpcomingRides(),
  });
};

export const useGiveRatingToDriverMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RatingData }) => {
      return await RidesService.ratingPassengerToDriver(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ride", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({ queryKey: ["driverRides"] });
    },
  });
};

export const useGiveRatingToPassengerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RatingData }) => {
      return await RidesService.ratingDriverToPassenger(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ride", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({ queryKey: ["driverRides"] });
    },
  });
};

export const useGetRatingByUserId = (id: string) => {
  return useQuery({
    queryKey: ["ride", id],
    queryFn: async () => await RidesService.getRatingByUserId(id),
    enabled: !!id,
  });
};

export const useGetGivenRatings = () => {
  return useQuery({
    queryKey: ["driverRides", "current"],
    queryFn: async () => await RidesService.getGivenRatings(),
  });
};
