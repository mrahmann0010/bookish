import { addDoc, collection } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { FaStar } from "react-icons/fa";

export default function IndBook({sldBook, books, bookCopy, selectedId, readLater, setReadLater, user}) {


    const tempBookdata = {
        title:'Harry potter',
        description:'Once upon a time, there was a boy',
    }

    const [bookData, setBookData] = useState(tempBookdata);
    const [isLoading, setIsLoading] = useState(false);
    const [isSel, setIsSel] = useState();
    

    const endPoint = 'https://openlibrary.org';
    const workId = sldBook;
    const endPointLast = '.json';

    const imgEnd = 'https://covers.openlibrary.org/b/id/';
    const imgSize ='-M.jpg';
    const altImg = 'https://thumbs.dreamstime.com/b/reading-books-15549459.jpg';
    // console.log(`${endPoint}${workId}`);

    useEffect(function(){

        const controller = new AbortController();

        async function fetchBookI() {

            try{

                setIsLoading(true);

                const res = await fetch(`${endPoint}${workId}${endPointLast}`,{signal:controller.signal});
                
                if(!res.ok) throw new Error('Fetching could not be completed');
                const data = await res.json();
                console.log(data);

                const {description, title, covers, subject_places, subject_people, subjects,key, subject_facet, revision} = data;

                const descriptionText = typeof description === 'object' ? description.value : description;
                
                const newBook = {
                    description: descriptionText? descriptionText: 'No description for this book was found',
                    title: title,
                    subject_places: subject_places? subject_places[0]:'No Location is mentioned',
                    covers:covers,
                    key:key,
                    coverImg:covers?`${imgEnd}${covers[0]}${imgSize}`:altImg,
                    revision:revision,

                }
                
                setBookData(newBook);
                

            } catch (err){
                console.error(err.message)
            }

            finally{
                setIsLoading(false);
            }
        }

        fetchBookI();

        return function () {
            controller.abort();
        }
    },[])

    function handleClick(bookDet) {
        setIsSel(bookDet);

        if(!readLater.find((item)=> item.key===bookDet.key)) {
            setReadLater((prevBooks)=>[ ...prevBooks, bookDet]);

            if(auth.currentUser) {
                const {title, key, description} = bookDet;
                const user = auth.currentUser.email;
                const userId = auth.currentUser.uid;

                const bookCol = collection(db, 'Books');
                addDoc(bookCol, {title, key, description, user, userId});
                console.log('done');
            }
            
        }     
        
    } 
    
    useEffect(function(){
        if(!auth.currentUser) {
            localStorage.setItem('readLater', JSON.stringify(readLater));
        }
        
    },[readLater]);
 
    return(
    <div className='book-con-main'>

        {isLoading && <Loading />}
        {!isLoading &&     
             
             <div className='ind-book'>
                <div className='ind-book-img'>
                    <img src={bookData.coverImg} />
                </div>

                <div className='ind-book-des'>

                    <h4>{bookData.title}</h4>
                    <h5>{books[selectedId].author_name?
                    books[selectedId].author_name: 'Author Information Not Available'}</h5>
                    <div className='genre'>
                        <span>Genre</span>
                        <h6>{
                        books[selectedId].subject_facet?books[selectedId].subject_facet.slice(0,2).join(', ')
                        :
                        'N/A'
                        }</h6>
                    </div>
                    
                    <div className='add-des'>
                        <div className='add-des-box'>
                            <span>Ratings</span>
                            <span className='rating'> 
                                <FaStar />
                            {books[selectedId].ratings_average!== undefined? 
                            books[selectedId].ratings_average.toFixed(0): 'N/A'}
                            </span>
                            
                        </div>

                        <div className='add-des-box'>
                            <span>Locations</span>
                            <span className='rating'>{bookData.subject_places}</span>
                        </div>
                    

                    </div>
                    <p> {bookData.description}</p>

                    {readLater.find((item) => item.coverImg === bookData.coverImg) ? (
                        <button className='ind-btn added' disabled>Already Added</button>
                            ) : (
                        <button onClick={() => handleClick(bookData)} className='ind-btn'>Add to Reading List</button>
                        )
                    }            
                
                </div>

            </div>
        
    }

    </div>
       
    )
}



function Loading() {
    return(
        <div className='loading'>
            <h6>Loading...</h6>

        </div>
    )
};

// Previusly --
{/* <span className='rating'> <FaStar />{books[selectedId].ratings_average.toFixed(0)}</span> */}