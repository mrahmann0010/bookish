import './App.css';
import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Card } from './components/Card';

const Home = lazy(() => import('./Pages/home'));
const Read = lazy(() => import('./Pages/read'));
const Profile = lazy(() => import('./Pages/profile'));
const IndBook = lazy(() => import('./Pages/book'));

function App() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [readLater, setReadLater] = useState(() => {
    const stored = localStorage.getItem('readLater');
    return stored ? JSON.parse(stored) : [];
  });
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-20">
        <Suspense
          fallback={
            <div className="p-8">
              <Card>Loading...</Card>
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  query={query}
                  setQuery={setQuery}
                  books={books}
                  setBooks={setBooks}
                />
              }
            />
            <Route
              path="/:id"
              element={
                <IndBook books={books} readLater={readLater} setReadLater={setReadLater} />
              }
            />
            <Route
              path="/read"
              element={<Read readLater={readLater} setReadLater={setReadLater} />}
            />
            <Route
              path="/profile"
              element={<Profile user={user} setUser={setUser} />}
            />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}

export default App;
