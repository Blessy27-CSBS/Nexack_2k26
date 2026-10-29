import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export function AdminProtectedRoute({ allowedRoles = [] }) {
  const { user, token, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen />;
  }

  const storedToken = token || localStorage.getItem('nexack_token');
  const roleLower = (role || user?.role || localStorage.getItem('nexack_role') || '').toLowerCase().replace(/\s+/g, '');
  const isAdminOrJudge = ['superadmin', 'admin', 'judge'].includes(roleLower);

  if (!storedToken || !isAdminOrJudge) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const allowedLower = allowedRoles.map(r => r.toLowerCase().replace(/\s+/g, ''));
    if (!allowedLower.includes(roleLower)) {
      if (roleLower === 'judge') {
        return <Navigate to="/admin/evaluations" replace />;
      }
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <Outlet />;
}

export function ParticipantProtectedRoute() {
  const { user, loading, role, token } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen />;
  }

  const storedToken = token || localStorage.getItem('nexack_token');
  const storedRole = role || user?.role || localStorage.getItem('nexack_role');
  const isParticipant = storedRole === 'participant' || (user && user.teamId);

  if (!storedToken || !isParticipant) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
