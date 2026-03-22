import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("events", "routes/events.tsx"),
  route("participants", "routes/participants.tsx"),
  index("routes/home.tsx"),
  route("profile", "routes/profile.tsx"),
  route("create-event", "routes/create-event.tsx"),
] satisfies RouteConfig;
