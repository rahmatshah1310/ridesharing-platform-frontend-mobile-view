import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { InputDialog } from "../../components/ui/InputDialog";
import { MapPin, Calendar, Clock, Users, ArrowLeft, X, CheckCircle2, User, Car, MessageSquare } from "lucide-react";
import { useGetRideRequestById, useCancelRideRequestMutation, useOfferRideToRequestMutation, useAcceptOfferMutation, useStartConversationMutation } from "../../api/api";
import { ROUTES } from "../../constants/routes";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";

const RideRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData } = useUser();
  const { data: request, isLoading } = useGetRideRequestById(id || "");
  const cancelMutation = useCancelRideRequestMutation();
  const offerMutation = useOfferRideToRequestMutation();
  const acceptOfferMutation = useAcceptOfferMutation();
  const startConversationMutation = useStartConversationMutation();

  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = React.useState(false);
  const [acceptOfferDialogOpen, setAcceptOfferDialogOpen] = React.useState(false);
  const [selectedOfferId, setSelectedOfferId] = React.useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "matched":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "declined":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleCancel = (reason?: string) => {
    if (!id) return;
    cancelMutation.mutate(
      { id, data: { reason: reason || undefined } },
      {
        onSuccess: () => {
          toast.success("Ride request cancelled successfully");
          navigate(ROUTES.rideRequests.myRequests);
        },
        onError: (error) => {
          toast.error(String(error));
        },
      }
    );
  };

  const handleOfferRide = (availableSeats: string) => {
    if (!id) return;
    const seats = parseInt(availableSeats);
    offerMutation.mutate(
      { requestId: id, data: { availableSeats: seats } },
      {
        onSuccess: () => {
          toast.success("Offer sent successfully");
        },
        onError: (error) => {
          toast.error(String(error));
        },
      }
    );
  };

  const handleAcceptOffer = () => {
    if (!id || !selectedOfferId) return;
    acceptOfferMutation.mutate(
      { requestId: id, offerId: selectedOfferId },
      {
        onSuccess: () => {
          toast.success("Offer accepted successfully");
          setSelectedOfferId(null);
        },
        onError: (error) => {
          toast.error(String(error));
        },
      }
    );
  };

  const openAcceptOfferDialog = (offerId: string) => {
    setSelectedOfferId(offerId);
    setAcceptOfferDialogOpen(true);
  };

  const handleStartChat = (userId: string) => {
    if (!userData || userId === userData._id) {
      toast.info("You cannot chat with yourself");
      return;
    }
    startConversationMutation.mutate(
      { receiverId: userId, rideId: request?.matchedRide && typeof request.matchedRide === "object" ? request.matchedRide._id : undefined },
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading ride request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <X className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ride Request Not Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">The ride request you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(ROUTES.rideRequests.myRequests)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPassenger = userData?.role === "passenger";
  const isDriver = userData?.role === "driver";
  const isOwner = isPassenger && typeof request.passenger === "object" && request.passenger._id === userData._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Ride Request Details</h1>
          </div>
        </div>

        {/* Status Badge */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(request.status)}`}>{request.status}</span>
              </div>
              {request.status === "open" && isDriver && (
                <Button onClick={() => setOfferDialogOpen(true)} disabled={offerMutation.isPending}>
                  {offerMutation.isPending ? "Sending..." : "Offer Ride"}
                </Button>
              )}
              {request.status === "open" && isOwner && (
                <Button variant="destructive" onClick={() => setCancelDialogOpen(true)} disabled={cancelMutation.isPending}>
                  {cancelMutation.isPending ? "Cancelling..." : "Cancel Request"}
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
                <p className="font-semibold text-gray-900 dark:text-white">{request.from}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">To</p>
                <p className="font-semibold text-gray-900 dark:text-white">{request.to}</p>
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
              <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatDate(request.dateTime)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Time
              </span>
              <span className="font-medium text-gray-900 dark:text-white">{formatTime(request.dateTime)}</span>
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
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{request.requiredSeats}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Required Seats</p>
            </div>
          </CardContent>
        </Card>

        {/* Passenger Information */}
        {request.passenger && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Passenger
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typeof request.passenger === "object" ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {request.passenger.profileImage ? (
                      <img src={request.passenger.profileImage} alt={request.passenger.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{request.passenger.name}</p>
                      {request.passenger.phone && <p className="text-sm text-gray-600 dark:text-gray-400">{request.passenger.phone}</p>}
                    </div>
                  </div>
                  {isDriver && (
                    <Button variant="outline" size="sm" onClick={() => handleStartChat(request.passenger._id)} disabled={startConversationMutation.isPending}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {startConversationMutation.isPending ? "Starting..." : "Chat"}
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Passenger ID: {request.passenger}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Matched Driver Information */}
        {request.matchedDriver && request.status === "matched" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Matched Driver
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typeof request.matchedDriver === "object" ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {request.matchedDriver.profileImage ? (
                      <img src={request.matchedDriver.profileImage} alt={request.matchedDriver.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{request.matchedDriver.name}</p>
                      {request.matchedDriver.phone && <p className="text-sm text-gray-600 dark:text-gray-400">{request.matchedDriver.phone}</p>}
                    </div>
                  </div>
                  {isOwner && (
                    <Button variant="outline" size="sm" onClick={() => handleStartChat(request.matchedDriver._id)} disabled={startConversationMutation.isPending}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {startConversationMutation.isPending ? "Starting..." : "Chat"}
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Driver ID: {request.matchedDriver}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Offers Section (for passengers) */}
        {isOwner && request.offers && request.offers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Offers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {request.offers.map((offer: any) => (
                <div key={offer._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {typeof offer.ride === "object" ? `${offer.ride.from} → ${offer.ride.to}` : "Ride Offer"}
                      </p>
                      {offer.status === "pending" && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Available seats: {typeof offer.ride === "object" ? offer.ride.availableSeats - (offer.ride.bookedSeats || 0) : "—"}</p>
                      )}
                    </div>
                    {offer.status === "pending" && (
                      <Button size="sm" onClick={() => openAcceptOfferDialog(offer._id)} disabled={acceptOfferMutation.isPending}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                    )}
                    {offer.status === "accepted" && <span className="text-sm text-green-600 dark:text-green-400">Accepted</span>}
                    {offer.status === "declined" && <span className="text-sm text-red-600 dark:text-red-400">Declined</span>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Cancellation Info */}
        {request.status === "cancelled" && request.cancellationReason && (
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Cancellation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300">{request.cancellationReason}</p>
              {request.cancelledAt && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Cancelled on: {new Date(request.cancelledAt).toLocaleString()}</p>}
            </CardContent>
          </Card>
        )}

        {/* Cancel Dialog */}
        <InputDialog
          open={cancelDialogOpen}
          onOpenChange={setCancelDialogOpen}
          title="Cancel Ride Request"
          description="Please provide a reason for cancellation (optional)"
          label="Cancellation Reason"
          placeholder="Enter reason (optional)"
          type="textarea"
          confirmText="Cancel Request"
          cancelText="Keep Request"
          variant="destructive"
          onConfirm={handleCancel}
          isLoading={cancelMutation.isPending}
        />

        {/* Offer Ride Dialog */}
        <InputDialog
          open={offerDialogOpen}
          onOpenChange={setOfferDialogOpen}
          title="Offer Ride"
          description="Enter the number of available seats for this ride request"
          label="Available Seats"
          placeholder="Enter seats (1-7)"
          type="number"
          min={1}
          max={7}
          confirmText="Send Offer"
          cancelText="Cancel"
          onConfirm={handleOfferRide}
          isLoading={offerMutation.isPending}
          validation={(value) => {
            const num = parseInt(value);
            if (isNaN(num)) return "Please enter a valid number";
            if (num < 1) return "Seats must be at least 1";
            if (num > 7) return "Seats must be at most 7";
            return null;
          }}
        />

        {/* Accept Offer Dialog */}
        <ConfirmDialog
          open={acceptOfferDialogOpen}
          onOpenChange={setAcceptOfferDialogOpen}
          title="Accept Offer"
          description="Are you sure you want to accept this ride offer?"
          confirmText="Accept Offer"
          cancelText="Cancel"
          onConfirm={handleAcceptOffer}
          isLoading={acceptOfferMutation.isPending}
        />
      </div>
    </div>
  );
};

export default RideRequestDetail;

