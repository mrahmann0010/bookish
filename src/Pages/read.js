import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "@firebase/firestore";
import { auth } from "../firebase";
import { IoIosCloseCircle } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router";
import bookIcon from '../Pages/book-icon.png';



const tempImg = bookIcon;



export default function Read({readLater, setReadLater}) {

    let lastAdded;
    let remainingItem;
    let numReadLater;

    const [isOpen, setIsOpen] = useState(false);
    const targetEl = useRef(null);

    const currentUser = auth.currentUser?auth.currentUser.email:null;

    const [bookDetails, setBookDetails] =useState([]);
    const [displayBook, setDisplayBook] = useState('');

    // For Deleting Testing
    const [targetB, setTargetB] = useState('');

    const navigate = useNavigate();


    function handleOpen(targetBook) {
        targetEl.current.style.display = 'flex';
        setIsOpen(prevState => !prevState);
        setDisplayBook(targetBook);

        setTargetB(targetBook.id);
    }

    function handleBtn() {
        if(isOpen) {
            setIsOpen(prevState=> !prevState);
            targetEl.current.style.display = 'none';
            
        }
    }

    function handleDelete(event, targetBook) {
        event.stopPropagation();
        

        setReadLater(prevDetails=> prevDetails.filter(book=> book.key !== targetBook.key));
        setBookDetails([...readLater]);
        

        const deleteBooks = async ()=>{
                    if(auth.currentUser) {
                        const bookCol = collection(db, 'Books');
                        try {
                            await deleteDoc(doc(db, 'Books', targetBook.id));
                        } catch (err){
                            console.log('Error in Deleting');
                        }
                    }
                }
        
                deleteBooks();

        // State takes time to render the UI, so Manual Navigation
        
        navigate(0);
        
    }

    useEffect(function(){
        localStorage.setItem('readLater', JSON.stringify(readLater));
    },[readLater, bookDetails]);

    useEffect(()=> {
        
        const getBooks = async ()=> {

            if(currentUser) {
                const bookCol = collection(db, 'Books');
                try{
                    const querySnapshot = await getDocs(bookCol);
                    const data = querySnapshot.docs.map((doc)=> {
                        return {
                            id:doc.id, ...doc.data()
                        }
                    } 
                    );
                    
                    const userData = data.filter((book)=>{
                        return book.user === auth.currentUser.email;
                    })
    
                    setBookDetails((prevDet)=> [ ...userData]);
    
                } catch (err) {
                    console.log(err.message);
                }
            } else {
                setBookDetails([...readLater])
            }
            
        }

        getBooks();
        
    },[readLater]);

    lastAdded = bookDetails.length>0?bookDetails[bookDetails.length-1]:null;
    remainingItem = bookDetails.slice(0,-1);
    numReadLater = bookDetails.length;


        return (
        <div className='read-con-main'>
            <div className='read-con'>
            <div className='read-hero'>
                <h2 id='read-list'>Read List</h2>
                <h2>Manage Your Reading List</h2>
                <button>
                <Link to='/'>Add Books</Link>
                </button>   
            </div>

            
            <ul className='read-list'>

            {bookDetails.length===0?
            <NoRecentDisplay message={'You have no recently added book'}/>
            : null
            }
            {bookDetails.length>0?
            <ReadRecent handleDelete={handleDelete} handleOpen={handleOpen} lastAdded={lastAdded}/>
            : null
            }
            {bookDetails.length>1?
            bookDetails.slice(0,-1).map((book, index) => ( // added index parameter
                <ReadNotRecent handleDelete={handleDelete} handleOpen={handleOpen} key={index} book={book} /> // added key prop
            )):
            null  
            }

            <ShowBookDes displayBook={displayBook}
            targetEl={targetEl} handleBtn={handleBtn}/>    
            </ul>
                 
        </div>
        </div>
        
    );
};


function ReadRecent({lastAdded, handleOpen, handleDelete}) {
    return(
        <li onClick={()=> handleOpen(lastAdded)} className='read-book recent'>
                    <div className='read-img'>
                        <img src={tempImg} alt='bookImg'></img>
                    </div>

                    <div className='read-det'>
                        <h5>{lastAdded.title}</h5>
                    </div>

                    <div className='read-btn'>
                        <button onClick={(e)=> handleDelete(e, lastAdded)}><MdDeleteForever /></button>
                    </div>
        </li>
    )
};

function ReadNotRecent({book, handleOpen, handleDelete}) {
    return(
        <li onClick={()=> handleOpen(book)} className='not-recent'>
                    <div className='dot'></div>

                    <div className='read-detnt'>
                        <h5>{book.title}</h5>
                    </div>

                    <div className='read-btn'>
                        <button onClick={(e)=> handleDelete(e, book)}><MdDeleteForever /></button>
                    </div>
        </li>
    )
};

function NoRecentDisplay({message}) {
    return(
        <div className='no-dis'>
            <p>{message}</p>
        </div>
    )
}


function ShowBookDes({targetEl, handleBtn, displayBook}) {
    return(
        <div ref={targetEl} className='showbook'>
            <span onClick={handleBtn} className='showBtn'>
                <button ><IoIosCloseCircle /></button>
            </span>

            <div className='ind-book-des'>
                <h4>{displayBook.title}</h4>
                <p> {displayBook.description}</p> 
                
            </div>
        </div>
    );
};