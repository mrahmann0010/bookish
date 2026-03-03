import React, { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from '@firebase/firestore';
import { Button } from '../components/Button';
import { FiChevronRight, FiBell, FiLock, FiHelpCircle } from 'react-icons/fi';

// ── Avatar initials ────────────────────────────────────────────
const Avatar = ({ email }) => {
  const initials = email
    ? email.slice(0, 2).toUpperCase()
    : '?';
  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{
        width: 72,
        height: 72,
        background: '#EDE6D6',
        border: '2.5px solid #C9813A',
        boxShadow: '0 0 0 4px rgba(201,129,58,0.15)',
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 700,
        fontSize: '24px',
        color: '#C9813A',
      }}
    >
      {initials}
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────────
const StatCard = ({ label, value }) => (
  <div
    className="flex-1 text-center py-5 px-3 rounded-[6px]"
    style={{
      background: '#EDE6D6',
      border: '1px solid #D9CEBB',
      boxShadow: '4px 6px 20px rgba(28,22,18,0.06)',
    }}
  >
    <p
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 700,
        fontSize: '28px',
        color: '#C9813A',
        lineHeight: 1,
        marginBottom: '6px',
      }}
    >
      {value}
    </p>
    <p
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '11px',
        color: '#8C7B6B',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      {label}
    </p>
  </div>
);

// ── Settings row ──────────────────────────────────────────────
const SettingsRow = ({ icon, label, sub }) => (
  <button
    className="w-full flex items-center gap-4 py-4 text-left transition-colors hover:bg-black/[0.02]"
    style={{
      borderBottom: '1px solid #D9CEBB',
      background: 'transparent',
    }}
  >
    <span style={{ color: '#8C7B6B', fontSize: '18px', flexShrink: 0 }}>{icon}</span>
    <span className="flex-1">
      <span
        display="block"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: '15px',
          color: '#1C1612',
          display: 'block',
        }}
      >
        {label}
      </span>
      {sub && (
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#8C7B6B',
            display: 'block',
            marginTop: '1px',
          }}
        >
          {sub}
        </span>
      )}
    </span>
    <FiChevronRight size={16} style={{ color: '#D9CEBB', flexShrink: 0 }} />
  </button>
);

export default function Profile({ user, setUser }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const toggleSignIn = () => {
    setIsSignIn((p) => !p);
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, [setUser]);

  // Firestore snapshot
  useEffect(() => {
    const postCol = collection(db, 'Books');
    const getPost = async () => {
      try {
        const querySnapshot = await getDocs(postCol);
        querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };
    getPost();
  }, []);

  /* ── Signed-in state ── */
  if (user) {
    return (
      <div
        style={{
          background: '#F5F0E8',
          minHeight: '100vh',
          paddingTop: '64px',
        }}
      >
        <div className="max-w-container mx-auto px-6 py-12">
          {/* Header card */}
          <div
            className="rounded-[6px] p-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            style={{
              background: '#1C1612',
              boxShadow: '4px 6px 24px rgba(28,22,18,0.18)',
            }}
          >
            <Avatar email={user.email} />
            <div>
              <h2
                className="mb-1"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: '24px',
                  color: '#F5F0E8',
                }}
              >
                Welcome back
              </h2>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '13px',
                  color: 'rgba(245,240,232,0.5)',
                }}
              >
                {user.email}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-4 mb-8 flex-wrap">
            <StatCard label="Books Saved" value="—" />
            <StatCard label="Reading" value="—" />
            <StatCard label="Finished" value="—" />
          </div>

          {/* Settings */}
          <div
            className="rounded-[6px] px-5 mb-6"
            style={{
              background: '#EDE6D6',
              border: '1px solid #D9CEBB',
              boxShadow: '4px 6px 20px rgba(28,22,18,0.06)',
            }}
          >
            <SettingsRow
              icon={<FiBell />}
              label="Notifications"
              sub="Manage reading reminders"
            />
            <SettingsRow
              icon={<FiLock />}
              label="Privacy & Security"
              sub="Password, data settings"
            />
            <SettingsRow
              icon={<FiHelpCircle />}
              label="Help & Feedback"
            />
          </div>

          {/* Sign out */}
          <Button
            variant="ghost"
            onClick={handleSignOut}
            style={{ color: '#9B3D2B' }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  /* ── Auth form ── */
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#F5F0E8', paddingTop: '64px' }}
    >
      <div
        className="w-full max-w-md rounded-[6px] p-8"
        style={{
          background: '#EDE6D6',
          border: '1px solid #D9CEBB',
          boxShadow: '4px 6px 20px rgba(28,22,18,0.10)',
        }}
      >
        {/* Title */}
        <h2
          className="mb-1 text-center"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: '26px',
            color: '#1C1612',
          }}
        >
          {isSignIn ? 'Sign in to Bookish' : 'Create an account'}
        </h2>
        <div
          className="mx-auto mb-7"
          style={{
            height: '2px',
            width: '48px',
            background: '#C9813A',
            borderRadius: '2px',
            marginTop: '8px',
          }}
        />

        {/* Error */}
        {error && (
          <p
            className="mb-4 text-sm text-center px-3 py-2 rounded-[3px]"
            style={{
              background: 'rgba(155,61,43,0.08)',
              color: '#9B3D2B',
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              border: '1px solid rgba(155,61,43,0.2)',
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={isSignIn ? handleSignIn : handleSignUp} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1.5"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px',
                color: '#8C7B6B',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 focus:outline-none transition-all duration-200"
              style={{
                background: '#F5F0E8',
                border: '1.5px solid #D9CEBB',
                borderRadius: '3px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                color: '#1C1612',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#C9813A')}
              onBlur={(e) => (e.target.style.borderColor = '#D9CEBB')}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1.5"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px',
                color: '#8C7B6B',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 focus:outline-none transition-all duration-200"
              style={{
                background: '#F5F0E8',
                border: '1.5px solid #D9CEBB',
                borderRadius: '3px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                color: '#1C1612',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#C9813A')}
              onBlur={(e) => (e.target.style.borderColor = '#D9CEBB')}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full justify-center mt-2">
            {isSignIn ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <p
          className="text-center mt-5"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            color: '#8C7B6B',
          }}
        >
          {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={toggleSignIn}
            className="transition-colors"
            style={{ color: '#C9813A', fontWeight: 500, background: 'none', border: 'none' }}
          >
            {isSignIn ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function Profile({ user, setUser }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const toggleSignIn = () => setIsSignIn((p) => !p);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, [setUser]);

  // Firestore snapshot example
  useEffect(() => {
    const postCol = collection(db, 'Books');
    const getPost = async () => {
      try {
        const querySnapshot = await getDocs(postCol);
        const data = querySnapshot.docs.map((doc) => doc.data());
        console.log(data);
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };
    getPost();
  }, []);

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-surface rounded-xl shadow-medium p-8 w-full max-w-md text-center">
          <h2 className="text-section font-bold mb-4">Welcome back!</h2>
          <p className="text-body mb-6">{user.email}</p>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-surface rounded-xl shadow-medium p-8 w-full max-w-md">
        <h2 className="text-section font-bold text-center mb-6">
          {isSignIn ? 'Sign in to Bookish' : 'Create an account'}
        </h2>
        <form onSubmit={isSignIn ? handleSignIn : handleSignUp} className="space-y-4">
          <div>
            <label className="block text-small mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="block text-small mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <Button type="submit" className="w-full">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
        <p className="text-center text-small mt-4">
          {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleSignIn} className="text-primary font-medium">
            {isSignIn ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
