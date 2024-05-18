import { useEffect, useState } from "react";

export default function Home() {

    const [selectBook, setSelectBook] = useState('');

    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);


    return (
        <div className='home'>
            <Hero>
                <SearchBar query={query} setQuery={setQuery}/>
            </Hero>
           <SearchResult>
            <BookList books={books} setBooks={setBooks} query={query}/>
           </SearchResult>
              
        </div>
    );
};


function Hero({children}) {
    return (
        <div className='hero'>
            <h2>Home</h2>
            <h3>The BookShelve you walways wanted</h3>
            <p>All of your Fav Books in one place</p>
            {children}
            
        </div>
    )
}

function SearchBar({query, setQuery}) {
    return (
        <div className='search-bar'>
            <span className="search-icon">&#128269;</span>
            <input type="text" className="search-input" placeholder="Search..."
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

function BookList({query, books, setBooks}) {


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
                if(data.docs.length===0) throw new Error('Book Not Found')

                console.log(data);
                let tempBooks =[];
                for(let i=0; i<10; i++) {
                    tempBooks.push(data.docs[i]);
                }
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
            return
        }
    
        fetchBooks(); // Call the fetchBooks function
        
        return function() {
            controller.abort();
        };
    
    }, [query]);



    
    return (
        <ul className='booklist'>
        
        {isloading && <Loading/>}
        {!isloading && !error && books.map((book=>(
          <Book book ={book} key={book.title}/>
        )))}
        {error && <ErrorMessage/>}

        {/* {books.map((book=>(
          <Book book ={book} key={book.title}/>
        )))} */}
            
        </ul>
    )
}

function Book({book}) {
    
    const imgEnd = 'https://covers.openlibrary.org/b/id/';
    const imgId = book.cover_i;

    const imgSize ='-M.jpg';

    console.log(imgId);
    
    return (
        <li className='book'>
            <div className='book-con'>
                <div className='book-img-con'>
                    <img alt={book.title} src={`${imgEnd}${imgId}${imgSize}`} />
                </div>
                <h4>{book.title}</h4>
                <h5>{book.author_name}</h5>
                <p>4.3</p>
            </div>

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




function IndBook() {
    return(
        <div className='ind-book'>
            <div className='ind-book-img'>

            </div>

            <div className='ind-book-des'>
                <h4>The kinf</h4>
                <h5>Yahmid </h5>
                <div className='add-des'>
                    <div className='add-des-box'>
                        <span>Rating</span>
                        <span>4.5</span>
                    </div>

                    <div className='add-des-box'>
                        <span>Rating</span>
                        <span>4.5</span>
                    </div>

                </div>
                <p>From the time of recall</p>
                
            </div>

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
}