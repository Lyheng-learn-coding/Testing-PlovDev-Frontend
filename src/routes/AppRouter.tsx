import { Route, Routes } from 'react-router-dom'
import AuthForm from '../auth/pages/AuthPage'
import HomePage from '../pages/HomePage'
import CoursePage from '../pages/CoursePage'
import Navbar from '../layouts/Navbar'
import OTPPage from '../auth/pages/OtpPage'
import ForgotPasswordPage from '../auth/pages/ForgotPassword'
import ResetPassword from '../auth/pages/ResetPassword'
import DashboardLayout from '@/layouts/DashboardLayout'

function AppRouter() {
  return (
    <Routes>

      <Route path="/" element={<Navbar />}>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/coursepage" element={<CoursePage />} />
      </Route>

        <Route path="/teacher" element={<DashboardLayout />} >
        
       </Route>

      <Route path="/authpage" element={<AuthForm />} />
      <Route path="/otppage" element={<OTPPage />} />
      <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
    </Routes>
  )
}

export default AppRouter
