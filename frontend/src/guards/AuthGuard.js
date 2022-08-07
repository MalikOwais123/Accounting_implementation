import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
// next
import { useRouter } from 'next/router'
// hooks
import useAuth from 'src/hooks/useAuth'
import Login from 'src/pages/auth/login'
// components
import LoadingScreen from 'src/components/LoadingScreen'
import { useSelector } from 'src/redux/store'
// routes
import { PATH_AUTH, PATH_DASHBOARD } from 'src/routes/paths'
// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
}

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return <>{children}</>
}
