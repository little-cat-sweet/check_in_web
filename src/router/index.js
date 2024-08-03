import React, { lazy } from "react";
import { Navigate } from "react-router-dom";

const One = lazy(() => import("../page/One"));
const Login = lazy(() => import("../page/Login"));
const withLoadingComponent = (comp) => (
    <React.Suspense fallback={<div>loading...</div>}>
        {comp}
    </React.Suspense>
);

const routes = [
    {
        path: "/",
        element: <Navigate to="/login" />,
    },
    {
        path: "/login",
        element: withLoadingComponent(<Login />),
        // children: [
        //     {
        //         path: "pageOne",
        //         element: withLoadingComponent(<One />),
        //     },
        //     {
        //         path: "pageTwo",
        //         element: withLoadingComponent(<Two />),
        //     },
        //     {
        //         path: "about",
        //         element: withLoadingComponent(<About />),
        //     },
        //     {
        //         path: "sub1/teamOne",
        //         element: withLoadingComponent(<TeamOne />),
        //     },
        //     {
        //         path: "*",
        //         element: withLoadingComponent(<One />),
        //     },
        // ],
    },
    {
        path: "one",
        element: <One />,
    },
];

export default routes;