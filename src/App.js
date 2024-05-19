
import './App.css';

// Icons
import { FaUserCircle } from "react-icons/fa";
import { IoLibraryOutline } from "react-icons/io5";
import { SiBookstack } from "react-icons/si";




// Components
import Home from './Pages/home';
import Read from './Pages/read';
import Later from './Pages/profile';
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import IndBook from './Pages/book';




export default function App() {

    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [sldBook, setSldBook] = useState(1);
    // const [readLater, setReadLater] = useState([]);

    const [user, setUser] = useState('');
    
    // Only for Author Information --Testing
    const [selectedId, setSelectedId] = useState(0);
    const [readLater, setReadLater] = useState(function(){
        const storedValue = localStorage.getItem('readLater');
        return storedValue? JSON.parse(storedValue): [];
    });


    let bookCopy = books;
    


  return (
    <>
        <BrowserRouter basename='/bookish'>
            <header>
                <nav className='nav-bar'>
                <NavLink exact path='/bookish'>
                    <span className='navI'><IoLibraryOutline /></span>
                    <span className='navT'>Search</span>
                    
                </NavLink>
                <NavLink to='read'>
                    <span className='navI'><SiBookstack /></span>
                    <span className='navT'>Reading List</span>
                </NavLink>
                <NavLink to='profile'>
                    <span className='navI'><FaUserCircle /></span>
                    <span className='navT'>Profile</span>
                </NavLink>
                </nav>
            </header>

            <main>
                <Routes>
                
                    <Route index element={<Home query={query}
                    books={books} setQuery={setQuery} setBooks={setBooks} sldBook={sldBook} setSldBook={setSldBook}
                    selectedId={selectedId} setSelectedId={setSelectedId} />}></Route>
                    <Route path='/:id' element={<IndBook sldBook={sldBook} bookCopy={bookCopy} books={books}
                    readLater={readLater} setReadLater={setReadLater} selectedId={selectedId}/>}
                    user={user}></Route>
                    <Route path='read' element={<Read setReadLater={setReadLater} readLater={readLater}/>}></Route>
                    <Route path='profile' element={<Later user={user} setUser={setUser}/>}></Route>
    
                </Routes>
            </main>
        </BrowserRouter>
    </>
  );
};

