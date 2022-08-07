import PropTypes from 'prop-types'
// guards
import AuthGuard from '../guards/AuthGuard'
import PaymentGuard from '../guards/PaymentGuard'
// components
import MainLayout from './main'
import DashboardLayout from './dashboard'
import LogoOnlyLayout from './LogoOnlyLayout'

// ----------------------------------------------------------------------

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['dashboard', 'main', 'logoOnly']),
}

export default function Layout({ variant = 'dashboard', children }) {
  if (variant === 'logoOnly') {
    return <LogoOnlyLayout> {children} </LogoOnlyLayout>
  }

  if (variant === 'main') {
    return <MainLayout>{children}</MainLayout>
  }

  return (
    // <PaymentGuard>
      <AuthGuard>
        <DashboardLayout> {children} </DashboardLayout>
      </AuthGuard>
    // </PaymentGuard>
  )
}
