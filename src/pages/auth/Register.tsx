import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonInput } from "../../components/components";
import { toast } from "react-toastify";
import { registerSchema, type RegisterFormValues } from "../../types/types";
import { useSignupMutation } from "../../api/api";
import { ROUTES } from "../../constants/routes";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      role: "passenger",
      cnic: "",
      city: "",
      district: "",
      country: "Pakistan",
      profileImage: undefined,
    },
  });

  // ✅ Same pattern as your sample: success/error handling in useEffect
  useEffect(() => {
    if (signupMutation.status === "success") {
      toast.success(signupMutation.data?.message || "Account created successfully");
      reset();
      navigate(ROUTES.auth.login);
    }

    if (signupMutation.status === "error") {
      toast.error(String(signupMutation.error));
    }
  }, [signupMutation.status]);

  const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("role", values.role);
      formData.append("profileImage", values.profileImage as File);
      formData.append("cnic", values.cnic);
      formData.append("city", values.city);
      formData.append("district", values.district);
      formData.append("country", values.country);

      signupMutation.mutate(formData);
    } catch (err: any) {
      alert(err?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img className="w-16 mb-10" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

        <form onSubmit={handleSubmit(onSubmit)}>
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

          <h3 className="text-lg font-medium mb-2">What's your city</h3>
          <Controller
            control={control}
            name="city"
            render={({ field }) => <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="City" />}
          />
          {errors.city && <p className="text-red-500 text-sm mb-4">{errors.city.message}</p>}

          <h3 className="text-lg font-medium mb-2">What's your district</h3>
          <Controller
            control={control}
            name="district"
            render={({ field }) => <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="District" />}
          />
          {errors.district && <p className="text-red-500 text-sm mb-4">{errors.district.message}</p>}

          <h3 className="text-lg font-medium mb-2">What's your country</h3>
          <Controller
            control={control}
            name="country"
            render={({ field }) => <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="Country" />}
          />
          {errors.country && <p className="text-red-500 text-sm mb-4">{errors.country.message}</p>}

          <h3 className="text-lg font-medium mb-2">Upload your profile picture</h3>
          <Controller
            control={control}
            name="profileImage"
            render={({ field }) => (
              <CommonInput className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="file" onChange={(e: any) => field.onChange(e.target.files?.[0])} />
            )}
          />
          {errors.profileImage && <p className="text-red-500 text-sm mb-4">{String(errors.profileImage.message)}</p>}

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg disabled:opacity-60 cursor-pointer" type="submit" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="text-center">
          Already have an account?{" "}
          <Link to={ROUTES.auth.login} className="text-blue-600 cursor-pointer">
            Login here
          </Link>
        </p>
        <p className="text-center">
          Want to register as a driver?{" "}
          <Link to={ROUTES.auth.registerDriver} className="text-blue-600 cursor-pointer">
            Register as Driver
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

export default Register;
