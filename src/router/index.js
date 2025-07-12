import React, {lazy} from "react";
import {Navigate} from "react-router-dom";

const Login = lazy(() => import("../page/Login"));
const Update = lazy(() => import("../page/Update"))
const Main = lazy(() => import("../page/Main"))
const Register = lazy(() => import("../page/Register"))
const EditProfile = lazy(() => import("../component/EditProfile"))
const NewMain = lazy(() => import("../page/NewMain"))
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
        },
        {
            path: "/editProfile",
            element: withLoadingComponent(<EditProfile/>)
        }, {
            path: "/newMain",
            element: withLoadingComponent(<NewMain/>)
        }
    ]
;

export default routes;