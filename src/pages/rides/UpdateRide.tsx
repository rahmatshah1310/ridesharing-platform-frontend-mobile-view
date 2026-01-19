import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonInput } from "../../components/components";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "react-toastify";
import { MapPin, Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { updateRideSchema, type UpdateRideFormValues } from "../../types/rides";
import { useUpdateRideMutation, useGetRideById } from "../../api/api";
import { ROUTES } from "../../constants/routes";
import { useUser } from "../../context/UserContext";

const UpdateRide: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { userData } = useUser();
  const { data: ride, isLoading: isLoadingRide } = useGetRideById(id || "");
  const updateRideMutation = useUpdateRideMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateRideFormValues>({
    resolver: zodResolver(updateRideSchema),
    defaultValues: {
      from: "",
      to: "",
      date: "",
      time: "",
      availableSeats: 1,
    },
  });

  // Populate form with existing ride data
  useEffect(() => {
    if (ride) {
      // Format departureTime to date and time
      const departureTime = ride.departureTime ? new Date(ride.departureTime) : null;
      const dateStr = departureTime ? departureTime.toISOString().split("T")[0] : "";
      
      // Format time to 12-hour format
      let timeStr = "";
      if (departureTime) {
        const hours = departureTime.getHours();
        const minutes = departureTime.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 || 12;
        timeStr = `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
      }

      reset({
        from: ride.from || "",
        to: ride.to || "",
        date: dateStr,
        time: timeStr,
        availableSeats: ride.availableSeats || 1,
        status: ride.status || "scheduled",
      });
    }
  }, [ride, reset]);

  useEffect(() => {
    if (updateRideMutation.status === "success") {
      toast.success("Ride updated successfully!");
      navigate(`${ROUTES.rides.detail}/${id}`);
    }

    if (updateRideMutation.status === "error") {
      toast.error(String(updateRideMutation.error));
    }
  }, [updateRideMutation.status, navigate, id]);

  // Check if user is a driver and owns this ride
  useEffect(() => {
    if (userData && userData.role !== "driver") {
      toast.error("Only drivers can update rides");
      navigate(ROUTES.home);
      return;
    }

    if (ride && userData) {
      const rideDriverId = typeof ride.driver === "object" ? ride.driver._id : ride.driver;
      if (String(rideDriverId) !== String(userData._id)) {
        toast.error("You can only update your own rides");
        navigate(ROUTES.rides.myRides);
      }
    }
  }, [userData, ride, navigate]);

  const onSubmit: SubmitHandler<UpdateRideFormValues> = async (values) => {
    if (!id) {
      toast.error("Ride ID is missing");
      return;
    }

    try {
      const updateData: any = {};
      
      if (values.from) updateData.from = values.from;
      if (values.to) updateData.to = values.to;
      if (values.availableSeats) updateData.availableSeats = values.availableSeats;
      if (values.status) updateData.status = values.status;
      
      // Only include date and time if both are provided
      if (values.date && values.time) {
        updateData.date = values.date;
        updateData.time = values.time;
      }

      updateRideMutation.mutate({
        id,
        data: updateData,
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to update ride. Please try again.");
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  if (isLoadingRide) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">Ride not found</p>
            <Button onClick={() => navigate(ROUTES.rides.myRides)} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(`${ROUTES.rides.detail}/${id}`)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Update Ride</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Modify the details of your ride</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ride Details</CardTitle>
            <CardDescription>Update the information for your ride</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* From Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  From
                </label>
                <Controller control={control} name="from" render={({ field }) => <CommonInput {...field} className="bg-gray-50 dark:bg-gray-800" type="text" placeholder="e.g., Islamabad" />} />
                {errors.from && <p className="text-red-500 text-sm mt-1">{errors.from.message}</p>}
              </div>

              {/* To Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  To
                </label>
                <Controller control={control} name="to" render={({ field }) => <CommonInput {...field} className="bg-gray-50 dark:bg-gray-800" type="text" placeholder="e.g., Lahore" />} />
                {errors.to && <p className="text-red-500 text-sm mt-1">{errors.to.message}</p>}
              </div>

              {/* Date and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </label>
                  <Controller control={control} name="date" render={({ field }) => <CommonInput {...field} className="bg-gray-50 dark:bg-gray-800" type="date" min={today} />} />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>

                {/* Time */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="w-4 h-4" />
                    Time
                  </label>
                  <Controller control={control} name="time" render={({ field }) => <CommonInput {...field} className="bg-gray-50 dark:bg-gray-800" type="text" placeholder="e.g., 06:00 PM" />} />
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
                </div>
              </div>

              {/* Available Seats */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="w-4 h-4" />
                  Available Seats
                </label>
                <Controller
                  control={control}
                  name="availableSeats"
                  render={({ field }) => (
                    <CommonInput {...field} className="bg-gray-50 dark:bg-gray-800" type="number" min={1} max={7} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                  )}
                />
                {errors.availableSeats && <p className="text-red-500 text-sm mt-1">{errors.availableSeats.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full" size="lg" disabled={updateRideMutation.isPending}>
                  {updateRideMutation.isPending ? "Updating Ride..." : "Update Ride"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateRide;

