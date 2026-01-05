export const ROUTES = {
   auth:{
    register: "/auth/register",
    login: "/auth/login",
    registerDriver: "/auth/register-driver",
    loginDriver: "/auth/login-driver",
   },
   home: "/",
   profile: "/profile",
   vehicleInformation: "/vehicle-information",
   rides: {
    create: "/rides/create",
    update: "/rides/update",
    myRides: "/rides/my-rides",
    browse: "/rides/browse",
    detail: "/rides",
   },
   rideRequests: {
    create: "/ride-requests/create",
    myRequests: "/ride-requests/my-requests",
    detail: "/ride-requests",
    driver: {
      open: "/ride-requests/driver/open",
      offers: "/ride-requests/driver/offers",
    },
   },
   messages: {
    list: "/messages",
    chat: "/messages/chat",
   },
  };
  