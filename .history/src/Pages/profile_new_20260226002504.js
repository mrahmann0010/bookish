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
