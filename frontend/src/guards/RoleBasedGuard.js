import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import { useSelector } from 'react-redux'
// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node,
};

const useCurrentRole = () => {
  // Logic here to get current user role
  const role = 'admin';
  return role;
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const role = useSelector(state => state.user)
  const currentRole = useCurrentRole();
  console.log("ROLE", role)

  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
