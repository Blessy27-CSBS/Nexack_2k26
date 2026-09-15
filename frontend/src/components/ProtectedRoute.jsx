import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export function AdminProtectedRoute({ allowedRoles = [] }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen text="Verifying credentials..." />;
  }

  const storedAdmin = localStorage.getItem('adminInfo') || localStorage.getItem('nexack_user');
  const roleLower = (user?.role || localStorage.getItem('nexack_role') || '').toLowerCase().replace(/\s+/g, '');
  const isAdminOrJudge = ['superadmin', 'admin', 'judge'].includes(roleLower);
  const adminUser = user || (storedAdmin ? JSON.parse(storedAdmin) : null);

  if (!isAdminOrJudge || (!user && !token)) {
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
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen text="Checking session..." />;
  }

  const storedParticipant = localStorage.getItem('participantInfo');
  const participantUser = user && user.role === 'Participant' ? user : storedParticipant ? JSON.parse(storedParticipant) : null;

  if (!participantUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
