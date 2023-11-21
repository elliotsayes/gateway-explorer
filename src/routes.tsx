import { RootRoute, Route, Router, createHashHistory, lazyRouteComponent } from "@tanstack/react-router";
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

export const observerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/observer/$host",
  component: lazyRouteComponent(importLazyComponents, 'Observer')
});

export const observerCurrentRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/observer/$host/current",
  component: lazyRouteComponent(importLazyComponents, 'ObserverCurrent'),
});

export const observerTxRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/observer/$host/$txId",
  component: lazyRouteComponent(importLazyComponents, 'ObserverTx')
});

export const splatRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <div>404 Not Found</div>,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  explorerRoute,
  observerRoute,
  observerCurrentRoute,
  observerTxRoute,
  splatRoute,
]);

// Use Hash History to support arweave gateway
const hashHistory = createHashHistory()

// Create the router using your route tree
export const router = new Router({ routeTree, history: hashHistory });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
