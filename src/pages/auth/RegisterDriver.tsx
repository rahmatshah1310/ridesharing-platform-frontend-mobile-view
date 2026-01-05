import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonInput } from "../../components/components";
import { toast } from "react-toastify";

import { registerDriverSchema, type RegisterDriverFormValues } from "../../types/authSchema";
import { useSignupMutation } from "../../api/api";
import { ROUTES } from "../../constants/routes";

const RegisterDriver: React.FC = () => {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterDriverFormValues>({
    resolver: zodResolver(registerDriverSchema),
    defaultValues: {
      name: "",
      phone: "",
      role: "driver",
      cnic: "",
      carName: "",
      carType: "",
      licenseNumber: "123456789",
      carNumberPlate: "ABC123",
      vehicleColor: "Red",
      carImages: [],
      vehicleSeats: 5,
      profileImage: undefined,
    },
  });

  // ✅ Same pattern as your sample: success/error handling in useEffect
  useEffect(() => {
    if (signupMutation.status === "success") {
      toast.success(signupMutation.data?.message || "Account created successfully");
      reset();
      navigate(ROUTES.auth.loginDriver);
    }

    if (signupMutation.status === "error") {
      toast.error(String(signupMutation.error));
    }
  }, [signupMutation.status]);

  const onSubmitDriverForm: SubmitHandler<RegisterDriverFormValues> = async (values) => {
    console.log("SUBMIT VALUES:", values);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("role", values.role);
      formData.append("profileImage", values.profileImage as File);
      formData.append("cnic", values.cnic);
      formData.append("carName", values.carName);
      formData.append("carType", values.carType);
      formData.append("licenseNumber", values.licenseNumber);
      formData.append("carNumberPlate", values.carNumberPlate);
      values.carImages.forEach((image) => {
        formData.append("carImages", image);
      });
      formData.append("vehicleColor", values.vehicleColor);
      formData.append("vehicleSeats", values.vehicleSeats?.toString() || "");

      signupMutation.mutate(formData);
    } catch (err: any) {
      alert(err?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img className="w-16 mb-10" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

        <form onSubmit={handleSubmit(onSubmitDriverForm)}>
          <h3 className="text-lg font-medium mb-2">What's your name</h3>
          <Controller
            control={control}
            name="name"
            render={({ field }) => <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="Name" />}
          />
          {errors.name && <p className="text-red-500 text-sm mb-4">{errors.name.message}</p>}

          <h3 className="text-lg font-medium mb-2">Enter your phone number</h3>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="Phone (digits only)" />
            )}
          />
          {errors.phone && <p className="text-red-500 text-sm mb-4">{errors.phone.message}</p>}

          <h3 className="text-lg font-medium mb-2">What's your role</h3>
          <Controller
            control={control}
            name="role"
            render={({ field }) => <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="Role" />}
          />
          {errors.role && <p className="text-red-500 text-sm mb-4">{errors.role.message}</p>}

          <h3 className="text-lg font-medium mb-2">What's your CNIC</h3>
          <Controller
            control={control}
            name="cnic"
            render={({ field }) => <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="CNIC (13 digits)" />}
          />
          {errors.cnic && <p className="text-red-500 text-sm mb-4">{errors.cnic.message}</p>}

          <h3 className="text-lg font-medium mb-2">What's your Car Name</h3>
          <Controller
            control={control}
            name="carName"
            render={({ field }) => <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="Car Name" />}
          />
          {errors.carName && <p className="text-red-500 text-sm mb-4">{errors.carName.message}</p>}

          <h3 className="text-lg font-medium mb-2">What's your carType</h3>
          <Controller
            control={control}
            name="carType"
            render={({ field }) => <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="carType" />}
          />
          {errors.carType && <p className="text-red-500 text-sm mb-4">{errors.carType.message}</p>}

          <h3 className="text-lg font-medium mb-2">What's your licenseNumber</h3>
          <Controller
            control={control}
            name="licenseNumber"
            render={({ field }) => <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="licenseNumber" />}
          />
          {errors.licenseNumber && <p className="text-red-500 text-sm mb-4">{errors.licenseNumber.message}</p>}

          <h3 className="text-lg font-medium mb-2">What's your Car Number Plate</h3>
          <Controller
            control={control}
            name="carNumberPlate"
            render={({ field }) => <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="Car Number Plate" />}
          />
          {errors.carNumberPlate && <p className="text-red-500 text-sm mb-4">{errors.carNumberPlate.message}</p>}

          <h3 className="text-lg font-medium mb-2">What's your Vehicle Color</h3>
          <Controller
            control={control}
            name="vehicleColor"
            render={({ field }) => <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="Vehicle Color" />}
          />
          {errors.vehicleColor && <p className="text-red-500 text-sm mb-4">{errors.vehicleColor.message}</p>}

          <h3 className="text-lg font-medium mb-2">What's your Vehicle Seats</h3>
          <Controller
            control={control}
            name="vehicleSeats"
            render={({ field }) => (
              <CommonInput
                type="number"
                placeholder="Vehicle Seats"
                value={field.value ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const v = e.target.value;
                  field.onChange(v === "" ? undefined : Number(v));
                }}
              />
            )}
          />

          {errors.vehicleSeats && <p className="text-red-500 text-sm mb-4">{errors.vehicleSeats.message}</p>}

          <h3 className="text-lg font-medium mb-2">Upload your profile picture</h3>
          <Controller
            control={control}
            name="profileImage"
            render={({ field }) => (
              <CommonInput
                name={field.name}
                ref={field.ref}
                type="file"
                accept="image/*"
                onBlur={field.onBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.files?.[0])}
              />
            )}
          />
          {errors.profileImage && <p className="text-red-500 text-sm mb-4">{String(errors.profileImage.message)}</p>}

          <h3 className="text-lg font-medium mb-2">Upload car images (1 to 3)</h3>

          <Controller
            control={control}
            name="carImages"
            render={({ field }) => (
              <CommonInput
                type="file"
                accept="image/*"
                multiple
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const files = Array.from(e.target.files ?? []);
                  field.onChange(files); // ✅ store File[] in RHF
                }}
              />
            )}
          />

          {errors.carImages && <p className="text-red-500 text-sm mb-4">{String(errors.carImages.message)}</p>}

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg disabled:opacity-60 cursor-pointer" type="submit" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="text-center">
          Want to register as a passenger?{" "}
          <Link to={ROUTES.auth.register} className="text-blue-600 cursor-pointer">
            Register as Passenger
          </Link>
        </p>
        <p className="text-center">
          Already have an account as a driver?{" "}
          <Link to={ROUTES.auth.loginDriver} className="text-blue-600 cursor-pointer">
            Login as Driver
          </Link>
        </p>
      </div>

      <div>
        <p className="text-[10px] leading-tight">
          This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span> and <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default RegisterDriver;
