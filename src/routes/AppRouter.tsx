import { Route, Routes } from 'react-router-dom'
import AuthForm from '../auth/pages/AuthPage'
import HomePage from '../pages/HomePage'
import CoursePage from '../pages/CoursePage'
import Navbar from '../layouts/Navbar'
import OTPPage from '../auth/pages/OtpPage'
import ForgotPasswordPage from '../auth/pages/ForgotPassword'
import ResetPassword from '../auth/pages/ResetPassword'
import DashboardLayout from '@/layouts/DashboardLayout'
import CreateCoursePage from '@/Clients/create-course/pages/CreateCoursePage'
import MyCoursePage from '@/Clients/myCourse/pages/MyCoursePage'

const publicRoutes = [
  { path: 'homepage', element: <HomePage /> },
  { path: 'coursepage', element: <CoursePage /> },
]

const teacherRoutes = [
  { path: 'create-course', element: <CreateCoursePage /> },
  { path: 'create-course/:id', element: <CreateCoursePage /> },
  { path: 'my-course/create-course', element: <CreateCoursePage /> },
  { path: 'my-course/create-course/:id', element: <CreateCoursePage /> },
  { path: 'my-course', element: <MyCoursePage /> },
]

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route path="/teacher" element={<DashboardLayout />}>
        {teacherRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route path="/authpage" element={<AuthForm />} />
      <Route path="/otppage" element={<OTPPage />} />
      <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
    </Routes>
  )
}

export default AppRouter
