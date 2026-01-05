import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonInput } from "../../components/components";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "react-toastify";
import { MapPin, Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { createRideRequestSchema, type CreateRideRequestFormValues } from "../../types/riderequest";
import { useCreateRideRequestMutation } from "../../api/api";
import { ROUTES } from "../../constants/routes";
import { useUser } from "../../context/UserContext";

const CreateRideRequest: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const createRideRequestMutation = useCreateRideRequestMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRideRequestFormValues>({
    resolver: zodResolver(createRideRequestSchema),
    defaultValues: {
      from: "",
      to: "",
      date: "",
      time: "",
      requiredSeats: 1,
    },
  });

  React.useEffect(() => {
    if (createRideRequestMutation.isSuccess) {
      toast.success("Ride request created successfully!");
      reset();
      navigate(ROUTES.rideRequests.myRequests);
    }
  }, [createRideRequestMutation.isSuccess, navigate, reset]);

  React.useEffect(() => {
    if (createRideRequestMutation.isError) {
      toast.error(String(createRideRequestMutation.error));
    }
  }, [createRideRequestMutation.isError, createRideRequestMutation.error]);

  // Check if user is a passenger
  React.useEffect(() => {
    if (userData && userData.role !== "passenger") {
      toast.error("Only passengers can create ride requests");
      navigate(ROUTES.home);
    }
  }, [userData, navigate]);

  const onSubmit: SubmitHandler<CreateRideRequestFormValues> = async (values) => {
    try {
      createRideRequestMutation.mutate({
        from: values.from,
        to: values.to,
        date: values.date,
        time: values.time,
        requiredSeats: values.requiredSeats,
        approxFarePerSeat: values.approxFarePerSeat,
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to create ride request. Please try again.");
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Request a Ride</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fill in the details to request a ride</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ride Request Details</CardTitle>
            <CardDescription>Enter where you want to go and when</CardDescription>
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
                  <Controller control={control} name="time" render={({ field }) => <CommonInput {...field} className="bg-gray-50 dark:bg-gray-800" type="text" placeholder="e.g., 10:00 PM" />} />
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Format: 10:00 PM</p>
                </div>
              </div>

              {/* Required Seats */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="w-4 h-4" />
                  Required Seats
                </label>
                <Controller
                  control={control}
                  name="requiredSeats"
                  render={({ field }) => (
                    <CommonInput {...field} className="bg-gray-50 dark:bg-gray-800" type="number" min={1} max={7} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                  )}
                />
                {errors.requiredSeats && <p className="text-red-500 text-sm mt-1">{errors.requiredSeats.message}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 1, Maximum 7 seats</p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full" size="lg" disabled={createRideRequestMutation.isPending}>
                  {createRideRequestMutation.isPending ? "Creating Request..." : "Create Ride Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRideRequest;
