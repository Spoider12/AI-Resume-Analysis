import { RouterProvider } from "react-router";
import {router} from "./app.route.jsx";
import { AuthProvider } from "./auth/auth.context.jsx";
import { InterviewProvider } from "./interview/interviewContext.jsx"

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router}/> 
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
