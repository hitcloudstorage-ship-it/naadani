import Layout from "@/components/Layout";
import Admin from "@/pages/Admin";
import AdminOrders from "@/pages/AdminOrders";
import AdminProducts from "@/pages/AdminProducts";
import Cart from "@/pages/Cart";
import Catalog from "@/pages/Catalog";
import Checkout from "@/pages/Checkout";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <Toaster position="top-center" richColors />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog",
  component: Catalog,
});
const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog/$productId",
  component: ProductDetail,
});
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: Cart,
});
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: Checkout,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});
const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/products",
  component: AdminProducts,
});
const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/orders",
  component: AdminOrders,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  catalogRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  adminRoute,
  adminProductsRoute,
  adminOrdersRoute,
]);

const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
