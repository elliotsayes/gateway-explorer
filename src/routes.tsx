import { RootRoute, Route, Router, createHashHistory, lazyRouteComponent, Outlet } from "@tanstack/react-router";
import { Root } from "./Root";
import GarLoader from "./components/GarLoader";

const importLazyComponents = () => import('./Lazy')

// Create a root route
const rootRoute = new RootRoute({
  component: Root,
});

const explorerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: GarLoader,
});

export const hostRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/gateway/$host",
  component: () => <Outlet/>
});

export const hostIndexRoute = new Route({
  getParentRoute: () => hostRoute,
  path: "/",
  component: () => <div>TODO</div>
});

export const reportsRoute = new Route({
  getParentRoute: () => hostRoute,
  path: "/reports/",
  component: () => <Outlet/>
});

export const reportsIndexRoute = new Route({
  getParentRoute: () => reportsRoute,
  path: "/",
  component: lazyRouteComponent(importLazyComponents, 'Observer')
});

export const reportsCurrentRoute = new Route({
  getParentRoute: () => reportsRoute,
  path: "/current",
  component: lazyRouteComponent(importLazyComponents, 'ObserverCurrent'),
});

export const reportsTxIdRoute = new Route({
  getParentRoute: () => reportsRoute,
  path: "/tx/$txId",
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
  hostRoute.addChildren([
    hostIndexRoute,
    reportsRoute.addChildren([
      reportsIndexRoute,
      reportsCurrentRoute,
      reportsTxIdRoute,
    ]),
  ]),
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
