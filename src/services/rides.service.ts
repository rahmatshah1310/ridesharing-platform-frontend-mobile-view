import { sendRequest } from "../utils/sendRequests";
import type {
  CreateRideData,
  UpdateRideData,
  CancelRideData,
  UpdateRideStatusData,
  GetRidesParams,
} from "../types/rides";

// Create a new ride
export const createRide = async (data: CreateRideData) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/rides",
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Rides Service [createRide] error: ${error}`);
    throw error;
  }
};

// Get all rides with optional status filter
export const getRides = async (params?: GetRidesParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    const url = queryParams.toString() ? `/rides?${queryParams.toString()}` : "/rides";
    
    const response = await sendRequest({
      method: "GET",
      url,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Rides Service [getRides] error: ${error}`);
    throw error;
  }
};

// Get a single ride by ID
export const getRideById = async (id: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/rides/${id}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Rides Service [getRideById] error: ${error}`);
    throw error;
  }
};

// Update a ride
export const updateRide = async (id: string, data: UpdateRideData) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/rides/${id}`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Rides Service [updateRide] error: ${error}`);
    throw error;
  }
};

// Delete a ride
export const deleteRide = async (id: string) => {
  try {
    const response = await sendRequest({
      method: "DELETE",
      url: `/rides/${id}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Rides Service [deleteRide] error: ${error}`);
    throw error;
  }
};

// Cancel a ride
export const cancelRide = async (id: string, data: CancelRideData) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/rides/${id}/cancel`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Rides Service [cancelRide] error: ${error}`);
    throw error;
  }
};

// Update ride status
export const updateRideStatus = async (id: string, data: UpdateRideStatusData) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/rides/${id}/status`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Rides Service [updateRideStatus] error: ${error}`);
    throw error;
  }
};

// Get all rides for the current driver
export const getDriverRides = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/rides/driver/my-rides",
    });
    return response.data.data;
  } catch (error) {
    console.log(`Rides Service [getDriverRides] error: ${error}`);
    throw error;
  }
};

// Get current ride for the current driver
export const getDriverCurrentRide = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/rides/driver/my-rides/current",
    });
    return response.data.data;
  } catch (error) {
    console.log(`Rides Service [getDriverCurrentRide] error: ${error}`);
    throw error;
  }
};

// Get past rides for the current driver
export const getDriverPastRides = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/rides/driver/my-rides/past",
    });
    return response.data.data;
  } catch (error) {
    console.log(`Rides Service [getDriverPastRides] error: ${error}`);
    throw error;
  }
};

// Get upcoming rides for the current driver
export const getDriverUpcomingRides = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/rides/driver/my-rides/upcoming",
    });
    return response.data.data;
  } catch (error) {
    console.log(`Rides Service [getDriverUpcomingRides] error: ${error}`);
    throw error;
  }
};

// Get upcoming rides for passenger
export const getPassengerUpcomingRides = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/rides/upcoming",
    });
    return response.data.data;
  } catch (error) {
    console.log(`Rides Service [getPassengerUpcomingRides] error: ${error}`);
    throw error;
  }
};

