import React, {lazy} from "react";
import {Navigate} from "react-router-dom";

const Login = lazy(() => import("../page/Login"));
const Update = lazy(() => import("../page/Update"))
const Main = lazy(() => import("../page/Main"))
const Register = lazy(() => import("../page/Register"))

const withLoadingComponent = (comp) => (
    <React.Suspense fallback={<div>loading...</div>}>
        {comp}
    </React.Suspense>
);

const routes = [
        {
            path: "/",
            element: <Navigate to="/login"/>
        },
        {
            path: "/login",
            element: withLoadingComponent(<Login/>)
        },
        {
            path: "/update",
            element: withLoadingComponent(<Update/>)
        },
        {
            path: "/main",
            element: withLoadingComponent(<Main/>)
        },
        {
            path: "/register",
            element: withLoadingComponent(<Register/>)
        }
    ]
;

export default routes;