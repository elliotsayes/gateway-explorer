import { RootRoute, Route, Router, lazyRouteComponent } from "@tanstack/react-router";
import { Root } from "./Root";
import GarLoader from "./components/GarLoader";

// Create a root route
const rootRoute = new RootRoute({
  component: Root,
});

const explorerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: GarLoader,
});

const importLazyComponents = () => import('./Lazy')

export const observerCurrentRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/observer/$host/current",
  component: lazyRouteComponent(importLazyComponents, 'ObserverCurrent'),
});

export const observerHistoryRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/observer/$host/history",
  component: lazyRouteComponent(importLazyComponents, 'ObserverHistory')
});

export const observerTxRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/observer/$host/$txId",
  component: lazyRouteComponent(importLazyComponents, 'ObserverTx')
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([explorerRoute, observerCurrentRoute, observerHistoryRoute, observerTxRoute]);

// Create the router using your route tree
export const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
