import './App.css';
import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Card } from './components/Card';
import { Footer } from './Layouts/RootLayout';

const Home    = lazy(() => import('./Pages/home'));
const Read    = lazy(() => import('./Pages/read'));
const Profile = lazy(() => import('./Pages/profile'));
const IndBook = lazy(() => import('./Pages/book'));

function App() {
  const [query, setQuery]   = useState('');
  const [books, setBooks]   = useState([]);
  const [readLater, setReadLater] = useState(() => {
    const stored = localStorage.getItem('readLater');
    return stored ? JSON.parse(stored) : [];
  });
  const [user, setUser] = useState(null);

  // Persist readLater to localStorage
  React.useEffect(() => {
    localStorage.setItem('readLater', JSON.stringify(readLater));
  }, [readLater]);

  return (
    <BrowserRouter>
      <div
        className="flex flex-col"
        style={{ minHeight: '100vh', background: '#F5F0E8' }}
      >
        <Navbar />
        <main className="flex-1 page-enter">
          <Suspense
            fallback={
              <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: '#F5F0E8' }}
              >
                <Card style={{ padding: '32px 48px', textAlign: 'center' }}>
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '13px',
                      color: '#8C7B6B',
                    }}
                  >
                    Loading&hellip;
                  </p>
                </Card>
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
                    readLater={readLater}
                    setReadLater={setReadLater}
                  />
                }
              />
              <Route
                path="/:id"
                element={
                  <IndBook
                    books={books}
                    readLater={readLater}
                    setReadLater={setReadLater}
                  />
                }
              />
              <Route
                path="/read"
                element={
                  <Read
                    readLater={readLater}
                    setReadLater={setReadLater}
                  />
                }
              />
              <Route
                path="/profile"
                element={<Profile user={user} setUser={setUser} />}
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
