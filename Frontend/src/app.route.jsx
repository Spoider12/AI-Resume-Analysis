import {createBrowserRouter} from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Protected from "./Components/Protected";
import Home from "./interview/pages/Home"
import Interview from "./interview/pages/interview"


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>

    },
    {
        path: "/register",
        element: <Register/>
    },{
        path:"/",
        element:<Protected>
            <Home/>
            </Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected>
            <Interview />
            </Protected>
    }
])