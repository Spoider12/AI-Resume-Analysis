import { RouterProvider } from "react-router";
import {router} from "./app.route.jsx";
import { AuthProvider } from "./auth/auth.context.jsx";
import { InterviewProvider } from "./interview/interviewContext.jsx"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router}/>
        <ToastContainer position="top-right" autoClose={3000} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
