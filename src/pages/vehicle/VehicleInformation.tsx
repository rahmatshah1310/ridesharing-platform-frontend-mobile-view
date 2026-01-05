import React from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Car, Image as ImageIcon, Calendar, Users, CheckCircle2, XCircle, Hash, Tag, AlertCircle, ArrowLeft } from "lucide-react";
import { ROUTES } from "../../constants/routes";

const VehicleInformation: React.FC = () => {
  const { userData } = useUser();
  const navigate = useNavigate();

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-gray-600 dark:text-gray-300">No user found. Please login again.</p>
      </div>
    );
  }

  // Check if user is a driver
  if (userData.role !== "driver") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">Vehicle information is only available for drivers.</p>
        </div>
      </div>
    );
  }

  const activeVehicle = userData.activeVehicle;
  const vehicles = userData.vehicles || [];

  // If no vehicles at all
  if (!activeVehicle && vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Vehicles Registered</h2>
              <p className="text-gray-600 dark:text-gray-400">You haven't registered any vehicles yet. Please register a vehicle to get started.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Vehicle Information</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and view your registered vehicles</p>
          </div>
          <Button onClick={() => navigate(ROUTES.home)} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Active Vehicle Section */}
        {activeVehicle && (
          <Card className="border-2 border-blue-500 dark:border-blue-400">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Active Vehicle
                  </CardTitle>
                  <CardDescription className="mt-1">Your currently active vehicle</CardDescription>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <VehicleDetails vehicle={activeVehicle} />
            </CardContent>
          </Card>
        )}

        {/* All Vehicles Section */}
        {vehicles.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">All Vehicles ({vehicles.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicles.map((vehicle) => (
                <Card key={vehicle._id} className={vehicle._id === activeVehicle?._id ? "border-2 border-blue-500 dark:border-blue-400" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Car className="w-5 h-5" />
                        {vehicle.carName} {vehicle.carType}
                      </CardTitle>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {vehicle.status === "active" ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </span>
                    </div>
                    {vehicle._id === activeVehicle?._id && <CardDescription className="text-blue-600 dark:text-blue-400 font-medium">Currently Active</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <VehicleDetails vehicle={vehicle} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty state if only active vehicle exists but no vehicles array */}
        {activeVehicle && vehicles.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">You have one active vehicle. Register more vehicles to see them listed here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Vehicle Details Component
interface VehicleDetailsProps {
  vehicle: {
    _id: string;
    carImages: string[];
    carName: string;
    carType: string;
    numberPlate: string;
    seats: number;
    status: "active" | "inactive";
    createdAt?: string;
    updatedAt?: string;
  };
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicle }) => {
  return (
    <div className="space-y-4">
      {/* Vehicle Images */}
      {vehicle.carImages && vehicle.carImages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Vehicle Images
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vehicle.carImages.map((image, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                <img src={image} alt={`${vehicle.carName} ${index + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vehicle Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="flex items-start gap-3">
          <Tag className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Car Name</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.carName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Car className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Car Type</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{vehicle.carType}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Hash className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Number Plate</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{vehicle.numberPlate}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Seats</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.seats} seats</p>
          </div>
        </div>

        {vehicle.createdAt && (
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Registered</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(vehicle.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        {vehicle.updatedAt && (
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(vehicle.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleInformation;
