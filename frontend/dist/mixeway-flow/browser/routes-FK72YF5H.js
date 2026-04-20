import "./chunk-4MWRP73S.js";

// src/app/views/pages/routes.ts
var routes = [
  {
    path: "404",
    loadComponent: () => import("./page404.component-UHZ7R35S.js").then((m) => m.Page404Component),
    data: {
      title: "Page 404"
    }
  },
  {
    path: "500",
    loadComponent: () => import("./page500.component-KLGN3TBB.js").then((m) => m.Page500Component),
    data: {
      title: "Page 500"
    }
  },
  {
    path: "login",
    loadComponent: () => import("./login.component-JP4T7VPW.js").then((m) => m.LoginComponent),
    data: {
      title: "Login Page"
    }
  },
  {
    path: "change",
    loadComponent: () => import("./change-password.component-DQIAHTQ7.js").then((m) => m.ChangePasswordComponent),
    data: {
      title: "Set Password"
    }
  },
  {
    path: "register",
    loadComponent: () => import("./register.component-PXPIMKPG.js").then((m) => m.RegisterComponent),
    data: {
      title: "Register Page"
    }
  }
];
export {
  routes
};
//# sourceMappingURL=routes-FK72YF5H.js.map
