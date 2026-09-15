import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nexack_token') || null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('nexack_token');
      const storedRole = localStorage.getItem('nexack_role');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          setRole(res.data.role);
          if (res.data.team) setTeam(res.data.team);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Auth token verification failed:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginAdmin = async (credentials) => {
    const res = await API.post('/auth/admin/login', credentials);
    if (res.data.success) {
      const { token, user } = res.data;
      localStorage.setItem('nexack_token', token);
      localStorage.setItem('nexack_role', user.role);
      localStorage.setItem('nexack_user', JSON.stringify(user));
      localStorage.setItem('adminInfo', JSON.stringify(user));
      setToken(token);
      setUser(user);
      setRole(user.role);
      return res.data;
    }
  };

  const loginParticipant = async (credentials) => {
    const res = await API.post('/auth/participant/login', credentials);
    if (res.data.success) {
      const { token, participant, team } = res.data;
      localStorage.setItem('nexack_token', token);
      localStorage.setItem('nexack_role', 'participant');
      setToken(token);
      setUser(participant);
      setRole('participant');
      setTeam(team);
      return res.data;
    }
  };

  const handleRegisterSuccess = (data) => {
    if (data.token) {
      localStorage.setItem('nexack_token', data.token);
      localStorage.setItem('nexack_role', 'participant');
      setToken(data.token);
      setUser(data.participant);
      setRole('participant');
      setTeam(data.team);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await API.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setRole(res.data.role);
        if (res.data.team) setTeam(res.data.team);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    localStorage.removeItem('nexack_token');
    localStorage.removeItem('nexack_role');
    setToken(null);
    setUser(null);
    setRole(null);
    setTeam(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      token,
      team,
      setTeam,
      loading,
      loginAdmin,
      loginParticipant,
      handleRegisterSuccess,
      refreshProfile,
      logout,
      isAdmin: role === 'admin' || role === 'superadmin',
      isSuperAdmin: role === 'superadmin',
      isJudge: role === 'judge',
      isParticipant: role === 'participant'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
