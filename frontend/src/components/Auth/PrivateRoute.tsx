import { Navigate } from 'react-router-dom'
import useAuthStore from '../../stores/useAuthStore'
import { PrivateRouteProps } from '../../types/auth'

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, loading } = useAuthStore()

  if (loading) {
    return <div>Chargement...</div>
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default PrivateRoute