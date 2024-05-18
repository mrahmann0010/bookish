import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FaStar } from "react-icons/fa";



export default function Home({query, books, setQuery, setBooks, 
    selectedId, setSelectedId, sldBook, setSldBook}) {


    return (
        <div className='home'>
            <Hero>
                <SearchBar query={query} setQuery={setQuery}/>
            </Hero>
           <SearchResult>
            <BookList books={books} setBooks={setBooks} query={query} sldBook={sldBook} setSldBook={setSldBook}
            selectedId={selectedId} setSelectedId={setSelectedId}/>
           </SearchResult>

              
        </div>
    );
};


function Hero({children}) {
    return (
        <div className='hero'>
            <h2>Home</h2>
            <h3>Your Ideal Book Corner</h3>
            <p>Discover Your Favorite Reads in One Place</p>
            {children}
            
        </div>
    )
}

function SearchBar({query, setQuery}) {
    return (
        <div className='search-bar'>
            <span className="search-icon"><IoIosSearch /></span>
            <input type="text" className="search-input" placeholder="Search Your Book Here..."
            value={query} onChange={(e)=> setQuery(e.target.value)}
            ></input>
        </div>
    )
}

function SearchResult({children}) {
    return (
        <div className='search-result'>
            {children}
        </div>
    )
}

function BookList({query, books, setBooks, sldBook, setSldBook, selectedId, setSelectedId}) {


    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const endPoint = 'https://openlibrary.org/search.json?q=';

    useEffect(function(){

        const controller = new AbortController();

        async function fetchBooks(){

            try{
                setIsLoading(true);  

                const res = await fetch(`${endPoint}${query}`,
                {signal:controller.signal});
                if(!res.ok) throw new Error('Something went wrong with fetching');

                const data = await res.json();
                if(data.docs.length===0) throw new Error('Book Not Found');
                
                console.log(data.docs.slice(0,10));

                
                const tempBooks = data.docs.slice(0, 10).map((tempbook,index)=>(
                    {
                        id:index,
                        title:tempbook.title,
                        author_name:tempbook.author_name,
                        cover_i:tempbook.cover_i,
                        key:tempbook.key,
                        first_published:tempbook.first_published_year,
                        ratings_average: tempbook.ratings_average,
                        subject_facet: tempbook.subject_facet,
                        want_to_read_count: tempbook.want_to_read, 

                    }
                ))

                setBooks(tempBooks);

            } catch (err){
                console.error(err.message);
                if(err.name!=='AbortError') {
                    setError(err.message);
                }
                
            }

            finally {
                setIsLoading(false)
            }
        }

        if(query.length<4) {
            setBooks([]);
            setError('');
            setIsLoading(false)
            return
        }
    
        fetchBooks(); // Call the fetchBooks function
        
        
        return function cleanup() {
            controller.abort();
        };
    
    }, [query]);
    
    return (
        <ul className='booklist'>
        
        {isloading && <Loading/>}
        {!isloading && !error && books.map((book=>(
          <Book book ={book} key={book.key} sldBook={sldBook} setSldBook={setSldBook}
          selectedId={selectedId} setSelectedId={setSelectedId}/>
        )))}
        {error && <ErrorMessage/>}
            
        </ul>
    )
}

function Book({book, sldBook, setSldBook, selectedId, setSelectedId}) {
    
    const imgEnd = 'https://covers.openlibrary.org/b/id/';
    const imgId = book.cover_i;
    const imgSize ='-M.jpg';


    function selectIndex(index) {
        setSelectedId(index);
    }
    function selectBook(id) {
        setSldBook(id);  
    }

    
    
    return (
        <li onClick={()=> selectIndex(book.id)}>
            <Link className='book' to={`${book.id}`} onClick={()=> selectBook(book.key)}>
                <div className='book-con'>
                <div className='book-img-con'>
                    <img alt={book.title} src={`${imgEnd}${imgId}${imgSize}`} />
                </div>
                <h5>{book.author_name}</h5>
                <h4>{book.title}</h4>
                <span className='rating'> <FaStar />{
                book.ratings_average?book.ratings_average.toFixed(1):
                'N/A'}</span>
                </div>
            </Link>
            

        </li>
    )
}



function Loading() {
    return(
        <div className='loading'>
            <h6>Loading...</h6>

        </div>
    )
}





const tempBooks = [
    {title: 'Lord of the rings', author_name:'J J Tolken'},
    {title: 'Harry Potter', author_name:'J K Rowling'},
    {title: 'James Bond', author_name:'Ian Martel'},
];



function ErrorMessage() {
    return(
        <div className='loading'>
            <h6>Something Went Wrong<br>
            </br>
            Book Not Found...
            </h6>

        </div>
    )
};