import React from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  User as UserIcon,
  Phone,
  MapPin,
  Shield,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  FileText,
  Award,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  Route,
  Navigation,
  MessageSquare,
} from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { useGetMyConversations } from "../../api/api";
import { LogOut } from "lucide-react";

const Profile: React.FC = () => {
  const { userData, logout } = useUser();
  const navigate = useNavigate();
  const { data: conversations } = useGetMyConversations();

  // Calculate total unread messages
  const conversationsArray = Array.isArray(conversations)
    ? conversations
    : conversations
      ? [conversations]
      : [];
  const totalUnreadMessages = conversationsArray.reduce(
    (total: number, conv: any) => {
      return total + (conv.unreadCount || 0);
    },
    0,
  );

  // Show loading state while userData is being fetched
  if (userData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if userData is explicitly undefined (not just null)
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No user found. Please login again.
            </p>
            <Button onClick={() => navigate(ROUTES.auth.login)}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPassenger = userData.role === "passenger";
  const isDriver = userData.role === "driver";
  const isActive = userData.status === "active";
  const isVerified = userData.isVerified;
  const isDriverApproved = userData.isDriverApproved;

  const hasRatings = (userData.totalRatings ?? 0) > 0;
  const averageRating = Number.isFinite(userData.averageRating)
    ? userData.averageRating
    : 0;

  const memberSince = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString()
    : "—";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 md:h-40 relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="relative">
                <img
                  src={
                    userData.profileImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random&size=128`
                  }
                  alt={userData.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                />
                {isActive && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800" />
                )}
              </div>
            </div>
          </div>

          <CardContent className="pt-16 md:pt-20 pb-6">
            <div className="text-center space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {userData.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {userData.phone}
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                    isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {isActive ? "Active" : "Blocked"}
                </span>

                {isVerified && (
                  <span className="px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}

                {isDriver && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1 ${
                      isDriverApproved
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {isDriverApproved ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Driver Approved
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Pending Approval
                      </>
                    )}
                  </span>
                )}

                <span className="px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 capitalize">
                  {userData.role}
                </span>
              </div>

              {/* Rating */}
              {hasRatings && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {userData.totalRatings}{" "}
                    {userData.totalRatings === 1 ? "rating" : "ratings"}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Passenger Profile Section */}
          {isPassenger && userData.passengerProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Passenger Profile
                </CardTitle>
                <CardDescription>
                  Your passenger account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {userData.passengerProfile.cnic && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          CNIC
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {userData.passengerProfile.cnic}
                        </p>
                      </div>
                    </div>
                  )}

                  {userData.passengerProfile.city && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Location
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {userData.passengerProfile.city}
                          {userData.passengerProfile.district
                            ? `, ${userData.passengerProfile.district}`
                            : ""}
                          {userData.passengerProfile.country
                            ? `, ${userData.passengerProfile.country}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    {userData.passengerProfile.isComplete ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                          Profile Complete
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                          Profile Incomplete
                        </span>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <Button
                      onClick={() => navigate(ROUTES.rides.browse)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Car className="w-4 h-4" />
                      Browse Rides
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => navigate(ROUTES.rideRequests.myRequests)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      My Ride Requests
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => navigate(ROUTES.messages.list)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 relative"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Messages
                      {totalUnreadMessages > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                          {totalUnreadMessages > 9 ? "9+" : totalUnreadMessages}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Driver Profile Section */}
          {isDriver && userData.driverProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Driver Profile
                </CardTitle>
                <CardDescription>
                  Your driver account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {userData.driverProfile.cnic && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          CNIC
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {userData.driverProfile.cnic}
                        </p>
                      </div>
                    </div>
                  )}

                  {userData.driverProfile.licenseNumber && (
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          License Number
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {userData.driverProfile.licenseNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {userData.driverProfile.vehicleColor && (
                    <div className="flex items-start gap-3">
                      <Car className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Vehicle Color
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {userData.driverProfile.vehicleColor}
                        </p>
                      </div>
                    </div>
                  )}

                  {userData.driverProfile.appliedAt && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Applied At
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(
                            userData.driverProfile.appliedAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {userData.driverProfile.approvedAt && (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Approved At
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(
                            userData.driverProfile.approvedAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    {userData.driverProfile.isComplete ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                          Profile Complete
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                          Profile Incomplete
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {userData.driverProfile.isVerified ? (
                      <>
                        <Shield className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                          Driver Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Verification Pending
                        </span>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <Button
                      onClick={() => navigate(ROUTES.vehicleInformation)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Car className="w-4 h-4" />
                      View Vehicle Information
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => navigate(ROUTES.rides.myRides)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Route className="w-4 h-4" />
                      My Rides
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => navigate(ROUTES.rideRequests.driver.open)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      View Ride Requests
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => navigate(ROUTES.messages.list)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 relative"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Messages
                      {totalUnreadMessages > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                          {totalUnreadMessages > 9 ? "9+" : totalUnreadMessages}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Car Images Section (Driver Only) */}
          {isDriver && (userData.driverProfile?.carImages?.length ?? 0) > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Vehicle Images
                </CardTitle>
                <CardDescription>
                  Your registered vehicle photos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userData.driverProfile!.carImages!.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                      <img
                        src={image}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Phone Number
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {userData.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Member Since
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {memberSince}
                  </p>
                </div>
              </div>

              {userData.currentMode && (
                <div className="flex items-start gap-3">
                  <UserIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Current Mode
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {userData.currentMode}
                    </p>
                  </div>
                </div>
              )}

              {typeof userData.is_online === "boolean" && (
                <div className="flex items-center gap-2 pt-2">
                  <div
                    className={`w-3 h-3 rounded-full ${userData.is_online ? "bg-green-500" : "bg-gray-400"}`}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {userData.is_online ? "Online" : "Offline"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Statistics
              </CardTitle>
              <CardDescription>Your account statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Average Rating
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {averageRating.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Ratings
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {userData.totalRatings ?? 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
