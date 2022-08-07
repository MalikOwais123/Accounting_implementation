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
  // const { isAuthenticated } = useSelector((state) => state.user)
  // const { /*isAuthenticated, */ isInitialized } = useAuth()
  const { isAuthenticated, isInitialized, isSelectedSubscription, selectedSubscription } = useAuth()

  const { pathname, push } = useRouter()

  const [requestedLocation, setRequestedLocation] = useState(null)

  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      setRequestedLocation(null)
      push(requestedLocation)
    }
  }, [pathname, push, requestedLocation])

  useEffect(() => {
    console.log('AUTH GUARD ', { selectedSubscription }, { isAuthenticated }, { isSelectedSubscription })
    // if (selectedSubscription?.paymentStatus === 'unpaid') push(PATH_AUTH.payment)
    if (isSelectedSubscription === false && isAuthenticated === true) push(PATH_AUTH.userCompanies)
    // else if (isSelectedSubscription === true && isAuthenticated === true) push(PATH_DASHBOARD.root)
  }, [isSelectedSubscription, isAuthenticated])

  if (!isInitialized) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname)
    }
    return <Login />
  }

  return <>{children}</>
}
