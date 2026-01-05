import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CommonInput } from "../../components/components";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../../types/types";
import { useSignInMutation } from "../../api/api";
import { toast } from "react-toastify";
import { ROUTES } from "../../constants/routes";
import { useUser } from "../../context/UserContext";

const UserLogin = () => {
  const navigate = useNavigate();
  const signinMutation = useSignInMutation();
  const { setAuthData } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
    },
  });

  useEffect(() => {
    if (signinMutation.status === "success") {
      setAuthData(signinMutation.data); // ✅ stores token + user
      toast.success(signinMutation.data?.message || "Login successful");
      navigate(ROUTES.home);
    }

    if (signinMutation.status === "error") {
      toast.error(String(signinMutation.error));
    }
  }, [signinMutation.status]);

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      const userData = {
        phone: values.phone,
      };
      signinMutation.mutate(userData);
    } catch (err: any) {
      alert(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img className="w-16 mb-10" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

        <form
          onSubmit={(e) => {
            handleSubmit(onSubmit)(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">Enter your phone number</h3>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <CommonInput {...field} className="bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base" type="text" placeholder="Phone (digits only)" />
            )}
          />
          {errors.phone && <p className="text-red-500 text-sm mb-4">{errors.phone.message}</p>}

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base cursor-pointer">Login</button>
        </form>
        <p className="text-center">
          New here?{" "}
          <Link to={ROUTES.auth.register} className="text-blue-600 cursor-pointer">
            Create new Account
          </Link>
        </p>
      </div>
      <div>
        <Link
          to={ROUTES.auth.loginDriver}
          className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base cursor-pointer"
        >
          Sign in as Driver
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
