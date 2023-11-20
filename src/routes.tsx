import { RootRoute, Route, Router, useParams } from "@tanstack/react-router";
import { Root } from "./Root";
import GarLoader from "./components/GarLoader";
import { CurrentReport } from "./components/CurrentReport";

// Create a root route
const rootRoute = new RootRoute({
  component: Root,
});

const explorerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: GarLoader,
});

const observerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/observer/$host/current",
  component: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const params = useParams({ from: observerRoute.id })
    return <CurrentReport host={params.host} />
  },
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([explorerRoute, observerRoute]);

// Create the router using your route tree
export const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
