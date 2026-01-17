import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { MapPin, Calendar, Clock, Users, ArrowLeft, Edit, Trash2, X, Send, MessageSquare, Star } from "lucide-react";
import {
  useGetRideById,
  useDeleteRideMutation,
  useCancelRideMutation,
  useUpdateRideStatusMutation,
  useRequestSpecificRideMutation,
  useStartConversationMutation,
  useGiveRatingToDriverMutation,
} from "../../api/api";
import { ROUTES } from "../../constants/routes";
import { toast } from "react-toastify";
import { ConfirmDialog, InputDialog } from "../../components/components";
import RatingModel from "../../components/models/RatingModel";
import { useUser } from "../../context/UserContext";
import type { RatingData } from "../../types/rides";

const RideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData } = useUser();
  const { data: ride, isLoading } = useGetRideById(id || "");
  const deleteMutation = useDeleteRideMutation();
  const cancelMutation = useCancelRideMutation();
  const updateStatusMutation = useUpdateRideStatusMutation();
  const requestRideMutation = useRequestSpecificRideMutation();
  const startConversationMutation = useStartConversationMutation();
  const giveRatingToDriverMutation = useGiveRatingToDriverMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [requestRideDialogOpen, setRequestRideDialogOpen] = useState(false);
  const [ratingModelOpen, setRatingModelOpen] = useState(false);

  const isPassenger = userData?.role === "passenger";
  const isDriver = userData?.role === "driver";
  const isRideOwner =
    isDriver &&
    ride?.driver &&
    (typeof ride.driver === "object"
      ? ride.driver._id === userData._id
      : ride.driver === userData._id);

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleDelete = () => {
    if (!id) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Ride deleted successfully");
        navigate(ROUTES.rides.myRides);
      },
      onError: (error) => {
        toast.error(String(error));
      },
    });
  };

  const handleCancel = (reason?: string) => {
    if (!id) return;
    cancelMutation.mutate(
      { id, data: { reason: reason || "Cancelled by driver" } },
      {
        onSuccess: () => {
          toast.success("Ride cancelled successfully");
        },
        onError: (error) => {
          toast.error(String(error));
        },
      }
    );
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (!id) return;
    updateStatusMutation.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success("Ride status updated successfully");
        },
        onError: (error) => {
          toast.error(String(error));
        },
      }
    );
  };

  const handleRequestRide = (requiredSeats: string) => {
    if (!id) return;
    const seats = parseInt(requiredSeats);
    if (isNaN(seats) || seats < 1 || seats > 7) {
      toast.error("Please enter a valid number of seats (1-7)");
      return;
    }
    requestRideMutation.mutate(
      { rideId: id, data: { requiredSeats: seats } },
      {
        onSuccess: () => {
          toast.success("Ride request sent successfully");
          navigate(ROUTES.rideRequests.myRequests);
        },
        onError: (error) => {
          toast.error(String(error));
        },
      }
    );
  };

  const handleStartChat = () => {
    if (!ride?.driver || !userData) return;
    const driverId =
      typeof ride.driver === "object" ? ride.driver._id : ride.driver;
    if (driverId === userData._id) {
      toast.info("You cannot chat with yourself");
      return;
    }
    startConversationMutation.mutate(
      { receiverId: driverId, rideId: id },
      {
        onSuccess: (data) => {
          navigate(`${ROUTES.messages.chat}/${data._id}`);
        },
        onError: (error) => {
          toast.error(String(error));
        },
      }
    );
  };

  const handleRatingSubmit = (data: RatingData) => {
    if (!id) return;
    giveRatingToDriverMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success("Rating submitted successfully");
          setRatingModelOpen(false);
        },
        onError: (error) => {
          toast.error(String(error));
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading ride details...
          </p>
        </div>
      </div>
    );
  }

  if (!ride) {
    const isPassengerCheck = userData?.role === "passenger";
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <X className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Ride Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The ride you're looking for doesn't exist.
            </p>
            <Button
              onClick={() =>
                navigate(
                  isPassengerCheck ? ROUTES.rides.browse : ROUTES.rides.myRides
                )
              }
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const driverName =
    typeof ride.driver === "object" ? ride.driver.name : "Driver";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Ride Details
            </h1>
          </div>
          {!isPassenger &&
            ride.status !== "completed" &&
            ride.status !== "cancelled" &&
            isRideOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`${ROUTES.rides.update}/${id}`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
        </div>

        {/* Status Badge */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Status
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                    ride.status
                  )}`}
                >
                  {ride.status?.replace("_", " ")}
                </span>
              </div>
              {!isPassenger && isRideOwner && (
                <>
                  {ride.status === "scheduled" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate("in_progress")}
                        disabled={updateStatusMutation.isPending}
                      >
                        Start Ride
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCancelDialogOpen(true)}
                        disabled={cancelMutation.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  {ride.status === "in_progress" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate("completed")}
                      disabled={updateStatusMutation.isPending}
                    >
                      Complete Ride
                    </Button>
                  )}
                </>
              )}
              {isPassenger &&
                ride.status === "scheduled" &&
                (ride.remainingSeats || ride.availableSeats || 0) > 0 && (
                  <Button
                    onClick={() => setRequestRideDialogOpen(true)}
                    disabled={requestRideMutation.isPending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {requestRideMutation.isPending
                      ? "Requesting..."
                      : "Request Ride"}
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Route Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Route
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">From</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {ride.from}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">To</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {ride.to}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Date
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatDate(ride.departureTime)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Time
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatTime(ride.departureTime)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Seats Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Seats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {ride.availableSeats || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Available
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {ride.bookedSeats || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Booked
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {ride.remainingSeats || ride.availableSeats || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Remaining
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Information */}
        {ride.driver && (
          <Card>
            <CardHeader>
              <CardTitle>Driver</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {typeof ride.driver === "object" && ride.driver.profileImage ? (
                    <img
                      src={ride.driver.profileImage}
                      alt={ride.driver.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {driverName}
                    </p>
                    {typeof ride.driver === "object" && ride.driver.phone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {ride.driver.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isPassenger && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleStartChat}
                      disabled={startConversationMutation.isPending}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {startConversationMutation.isPending
                        ? "Starting..."
                        : "Chat"}
                    </Button>
                  )}
                </div>
              </div>
              {isPassenger && ride.status === "completed" && (
                <div className="mt-4">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => setRatingModelOpen(true)}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Rate Driver
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}


        {/* Cancellation Info */}
        {ride.status === "cancelled" && ride.cancellationReason && (
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">
                Cancellation Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {ride.cancellationReason}
              </p>
              {ride.cancelledAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Cancelled on: {new Date(ride.cancelledAt).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit and Delete Buttons - Only for ride owner (driver) */}
        {!isPassenger &&
          isRideOwner &&
          ride.status !== "completed" &&
          ride.status !== "in_progress" && (
            <div className="pt-4 space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`${ROUTES.rides.update}/${id}`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Ride
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleteMutation.isPending ? "Deleting..." : "Delete Ride"}
              </Button>
            </div>
          )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Ride"
          description="Are you sure you want to delete this ride? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
        />

        {/* Cancel Ride Dialog */}
        <InputDialog
          open={cancelDialogOpen}
          onOpenChange={setCancelDialogOpen}
          title="Cancel Ride"
          description="Please provide a reason for cancellation"
          label="Cancellation Reason"
          placeholder="Enter reason (optional)"
          type="textarea"
          confirmText="Cancel Ride"
          cancelText="Keep Ride"
          variant="destructive"
          onConfirm={handleCancel}
          isLoading={cancelMutation.isPending}
        />

        {/* Request Ride Dialog - For Passengers */}
        <InputDialog
          open={requestRideDialogOpen}
          onOpenChange={setRequestRideDialogOpen}
          title="Request Ride"
          description={`Request a seat on this ride from ${ride.from} to ${ride.to}`}
          label="Required Seats"
          placeholder="Enter number of seats (1-7)"
          type="number"
          min={1}
          max={7}
          confirmText="Send Request"
          cancelText="Cancel"
          onConfirm={handleRequestRide}
          isLoading={requestRideMutation.isPending}
          validation={(value) => {
            const num = parseInt(value);
            if (isNaN(num)) return "Please enter a valid number";
            if (num < 1) return "At least 1 seat is required";
            if (num > 7) return "Maximum 7 seats allowed";
            if (num > (ride.remainingSeats || ride.availableSeats || 0)) {
              return `Only ${
                ride.remainingSeats || ride.availableSeats || 0
              } seats available`;
            }
            return null;
          }}
        />

        {/* Rating Modal */}
        <RatingModel
          open={ratingModelOpen}
          onOpenChange={setRatingModelOpen}
          type="driver"
          name={driverName}
          onSubmit={handleRatingSubmit}
          isLoading={giveRatingToDriverMutation.isPending}
        />
      </div>
    </div>
  );
};

export default RideDetail;
