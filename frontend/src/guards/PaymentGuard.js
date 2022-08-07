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

PaymentGuard.propTypes = {
  children: PropTypes.node,
}

export default function PaymentGuard({ children }) {
  const { isAuthenticated, isInitialized, isSelectedSubscription, selectedSubscription } = useAuth()

  const { pathname, push } = useRouter()

  useEffect(() => {
    if (selectedSubscription?.paymentStatus === 'unpaid') push(PATH_AUTH.payment)
    console.log('PAYMENT GUARD')
  }, [isSelectedSubscription, isAuthenticated])

  if (!isAuthenticated || !isInitialized) {
    return <LoadingScreen />
  }

  return <>{children}</>
}
