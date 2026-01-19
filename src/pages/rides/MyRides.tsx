import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Car, Calendar, MapPin, Users, Clock, Plus, ArrowLeft, AlertCircle } from "lucide-react";
import { useGetDriverRides, useGetDriverCurrentRide, useGetDriverPastRides, useGetDriverUpcomingRides } from "../../api/api";
import { ROUTES } from "../../constants/routes";

const MyRides: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [activeTab, setActiveTab] = React.useState<"all" | "current" | "past" | "upcoming">("all");

  const { data: allRides, isLoading: loadingAll, error: errorAll } = useGetDriverRides();
  const { data: currentRides, isLoading: loadingCurrent, error: errorCurrent } = useGetDriverCurrentRide();
  const { data: pastRides, isLoading: loadingPast, error: errorPast } = useGetDriverPastRides();
  const { data: upcomingRides, isLoading: loadingUpcoming, error: errorUpcoming } = useGetDriverUpcomingRides();

  if (!userData || userData.role !== "driver") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-gray-600 dark:text-gray-300">Only drivers can view rides.</p>
      </div>
    );
  }

  const getRidesData = () => {
    switch (activeTab) {
      case "current":
        return { data: currentRides, loading: loadingCurrent, error: errorCurrent };
      case "past":
        return { data: pastRides, loading: loadingPast, error: errorPast };
      case "upcoming":
        return { data: upcomingRides, loading: loadingUpcoming, error: errorUpcoming };
      default:
        return { data: allRides, loading: loadingAll, error: errorAll };
    }
  };

  const { data: rides, loading, error } = getRidesData();
  const ridesArray = Array.isArray(rides) ? rides : rides ? [rides] : [];

  // Extract error message
  const errorMessage = error ? (typeof error === "string" ? error : String(error)) : null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"     onClick={() => navigate(ROUTES.home)} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Rides</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your rides</p>
            </div>
          </div>
          <Button onClick={() => navigate(ROUTES.rides.create)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Create Ride</span>
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "all", label: "All" },
            { id: "current", label: "Current" },
            { id: "upcoming", label: "Upcoming" },
            { id: "past", label: "Past" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && !loading && (
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardContent className="py-8 text-center">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Rides</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">{errorMessage || "An error occurred while loading your rides. Please try again later."}</p>
            </CardContent>
          </Card>
        )}

        {/* Rides List */}
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading rides...</p>
            </CardContent>
          </Card>
        ) : error ? null : ridesArray.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Rides Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{activeTab === "all" ? "You haven't created any rides yet." : `No ${activeTab} rides found.`}</p>
              <Button onClick={() => navigate(ROUTES.rides.create)} className="flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" />
                Create Your First Ride
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {ridesArray.map((ride: any) => (
              <Card key={ride._id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`${ROUTES.rides.detail}/${ride._id}`)}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">{ride.from}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{ride.to}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(ride.departureTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(ride.departureTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {ride.remainingSeats || ride.availableSeats} seats available
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(ride.status)}`}>{ride.status?.replace("_", " ")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRides;
