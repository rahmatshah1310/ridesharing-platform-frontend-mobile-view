import { Routes as RouterRoutes, Route } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import RegisterDriver from "./pages/auth/RegisterDriver";
import LoginDriver from "./pages/auth/LoginDriver";
import Profile from "./pages/profile/Profile";
import VehicleInformation from "./pages/vehicle/VehicleInformation";
import CreateRide from "./pages/rides/CreateRide";
import UpdateRide from "./pages/rides/UpdateRide";
import MyRides from "./pages/rides/MyRides";
import BrowseRides from "./pages/rides/BrowseRides";
import RideDetail from "./pages/rides/RideDetail";
import CreateRideRequest from "./pages/riderequests/CreateRideRequest";
import MyRideRequests from "./pages/riderequests/MyRideRequests";
import DriverRideRequests from "./pages/riderequests/DriverRideRequests";
import RideRequestDetail from "./pages/riderequests/RideRequestDetail";
import Conversations from "./pages/messages/Conversations";
import Chat from "./pages/messages/Chat";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

export const Routes: React.FC = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<AuthLayout />}>
        <Route path={ROUTES.auth.login} element={<Login />} />
        <Route path={ROUTES.auth.register} element={<Register />} />
        <Route path={ROUTES.auth.registerDriver} element={<RegisterDriver />} />
        <Route path={ROUTES.auth.loginDriver} element={<LoginDriver />} />
      </Route>

      <Route path="/" element={<AppLayout />}>
        <Route index element={<Profile />} />
        <Route path={ROUTES.vehicleInformation} element={<VehicleInformation />} />
        <Route path={ROUTES.rides.create} element={<CreateRide />} />
        <Route path={`${ROUTES.rides.update}/:id`} element={<UpdateRide />} />
        <Route path={ROUTES.rides.myRides} element={<MyRides />} />
        <Route path={ROUTES.rides.browse} element={<BrowseRides />} />
        <Route path={`${ROUTES.rides.detail}/:id`} element={<RideDetail />} />
        <Route path={ROUTES.rideRequests.create} element={<CreateRideRequest />} />
        <Route path={ROUTES.rideRequests.myRequests} element={<MyRideRequests />} />
        <Route path={ROUTES.rideRequests.driver.open} element={<DriverRideRequests />} />
        <Route path={`${ROUTES.rideRequests.detail}/:id`} element={<RideRequestDetail />} />
        <Route path={ROUTES.messages.list} element={<Conversations />} />
        <Route path={`${ROUTES.messages.chat}/:id`} element={<Chat />} />
      </Route>
    </RouterRoutes>
  );
};

export default Routes;
