import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "@firebase/firestore";
import { auth } from "../firebase";

const tempImg = 'https://t4.ftcdn.net/jpg/03/52/82/79/360_F_352827963_o9ODYzxeKczlZWKaFBsPLOQ4b6f6P533.jpg';






export default function Read({readLater}) {

    let lastAdded;
    let remainingItem;
    let numReadLater;

    const currentUser = auth.currentUser?auth.currentUser.email:null;

    const [bookDetails, setBookDetails] =useState([]);

    useEffect(()=> {
        const getBooks = async ()=> {
            const bookCol = collection(db, 'Books');
            try{
                const querySnapshot = await getDocs(bookCol);
                const data = querySnapshot.docs.map((doc)=> doc.data());
                
                const userData = data.filter((book)=>{
                    return book.user === auth.currentUser.email;
                })

                setBookDetails((prevDet)=> [ ...userData]);

            } catch (err) {
                console.log(err.message);
            }
        }

        getBooks();
        
    },[])

    

    lastAdded = bookDetails.length>0?bookDetails[bookDetails.length-1]:null;
    remainingItem = bookDetails.slice(0,-1);
    numReadLater = bookDetails.length;

    
    console.log(readLater);

    

        return (
        <div className='read-con-main'>
            <div className='read-con'>
            <div className='read-hero'>
                <h2>Manage Your Reading List</h2>
                <button>
                <Link to='/'>Add Books</Link>
                </button>   
            </div>

            {currentUser?
            <ul className='read-list'>

            {bookDetails.length===0?
            <NoRecentDisplay message={'You have no recently added book'}/>
            : null
            }
            {bookDetails.length>0?
            <ReadRecent lastAdded={lastAdded}/>
            : null
            }
            {bookDetails.length>1?
            bookDetails.slice(0,-1).map((book, index) => ( // added index parameter
                <ReadNotRecent key={index} book={book} /> // added key prop
            )):
            null  
            }    
            </ul>
            :
            <div className='read-auth'></div>
            }
            
            
            
        </div>
        </div>
        
    );
};


function ReadRecent({lastAdded}) {
    return(
        <li className='read-book recent'>
                    <div className='read-img'>
                        <img src={tempImg}></img>
                    </div>

                    <div className='read-det'>
                        <h5>{lastAdded.title}</h5>
                        <p>{lastAdded.subject_places}</p>
                    </div>

                    <div className='read-p'>
                        <p></p>
                    </div>
        </li>
    )
};

function ReadNotRecent({book}) {
    return(
        <li className='not-recent'>
                    <div className='dot'></div>

                    <div className='read-detnt'>
                        <h5>{book.title}</h5>
                        <p>{book.subject_places}</p>
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