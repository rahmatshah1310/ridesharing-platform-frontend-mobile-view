import { sendRequest } from "../utils/sendRequests";
import type {
  CreateRideRequestData,
  RequestSpecificRideData,
  OfferRideRequestData,
  CancelRideRequestData,
} from "../types/riderequest";

// Create a new ride request
export const createRideRequest = async (data: CreateRideRequestData) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/ride-requests",
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [createRideRequest] error: ${error}`);
    throw error;
  }
};

// Request a specific ride
export const requestSpecificRide = async (rideId: string, data: RequestSpecificRideData) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/ride-requests/${rideId}/request-specific`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [requestSpecificRide] error: ${error}`);
    throw error;
  }
};

// Get single ride request
export const getRideRequestById = async (id: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/ride-requests/${id}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [getRideRequestById] error: ${error}`);
    throw error;
  }
};

// Cancel ride request
export const cancelRideRequest = async (id: string, data: CancelRideRequestData) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/ride-requests/${id}/cancel`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [cancelRideRequest] error: ${error}`);
    throw error;
  }
};

// Get all ride requests for driver
export const getDriverRideRequests = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/ride-requests/driver/currentDriver",
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [getDriverRideRequests] error: ${error}`);
    throw error;
  }
};

// Get all ride requests for passenger
export const getPassengerRideRequests = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/ride-requests/passenger",
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [getPassengerRideRequests] error: ${error}`);
    throw error;
  }
};

// Get past ride requests for passenger
export const getPassengerPastRideRequests = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/ride-requests/passenger/past",
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [getPassengerPastRideRequests] error: ${error}`);
    throw error;
  }
};

// Get upcoming ride requests for passenger
export const getPassengerUpcomingRideRequests = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/ride-requests/passenger/upcoming",
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [getPassengerUpcomingRideRequests] error: ${error}`);
    throw error;
  }
};

// Get current ride requests for passenger
export const getPassengerCurrentRideRequests = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/ride-requests/passenger/current",
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [getPassengerCurrentRideRequests] error: ${error}`);
    throw error;
  }
};

// Get all ride requests for a single ride
export const getRideRequestsByRide = async (rideId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/rides/${rideId}/requests`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [getRideRequestsByRide] error: ${error}`);
    throw error;
  }
};

// Offer a ride to ride request
export const offerRideToRequest = async (requestId: string, data: OfferRideRequestData) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/ride-requests/${requestId}/offer`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [offerRideToRequest] error: ${error}`);
    throw error;
  }
};

// Get offers for current driver
export const getDriverOffers = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/ride-requests/driver/offers",
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [getDriverOffers] error: ${error}`);
    throw error;
  }
};

// Accept offer
export const acceptOffer = async (requestId: string, offerId: string) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/ride-requests/${requestId}/offers/${offerId}/accept-offer`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [acceptOffer] error: ${error}`);
    throw error;
  }
};

// Get all open requests for driver
export const getOpenRideRequestsForDriver = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/ride-requests/driver/open",
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [getOpenRideRequestsForDriver] error: ${error}`);
    throw error;
  }
};

// Get past ride requests for driver
export const getPastRideRequestsForDriver = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/ride-requests/driver/past",
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [getPastRideRequestsForDriver] error: ${error}`);
    throw error;
  }
};

// Get upcoming ride requests for driver
export const getUpcomingRideRequestsForDriver = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/ride-requests/driver/upcoming",
    });
    return response.data.data;
  } catch (error) {
    console.log(`RideRequest Service [getUpcomingRideRequestsForDriver] error: ${error}`);
    throw error;
  }
};

