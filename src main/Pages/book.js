import { addDoc, collection } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";

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

                const {description, title, covers, subject_places, subject_people, subjects,key} = data;

                const descriptionText = typeof description === 'object' ? description.value : description;
                
                const newBook = {
                    description: descriptionText? descriptionText: 'No description was found',
                    title: title,
                    subject_places: subject_places? subject_places.join(', '):'No Subject places was found',
                    covers:covers,
                    key:key,
                    coverImg:covers?`${imgEnd}${covers[0]}${imgSize}`:altImg,

                }

                // console.log(`${imgEnd}${covers[0]}${imgSize}`);
                
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

        if(!readLater.find((item)=> item.coverImg===bookDet.coverImg)) {
            setReadLater([...readLater, bookDet]);
        }   
        
        console.log(readLater);
        console.log(books);
    } 
    
    
    // useEffect( ()=> {
    //     try{
    //         await Promise.all(
    //             const uploadData = async() => {
    //                 readLater.forEach((item)=>{
    //                     const {title, key } = item;
    //                     const user = auth.currentUser.email;
    //                     const userId = auth.currentUser.uid;
    //                     // console.log(title, key);
    //                     // console.log(auth.currentUser.email, auth.currentUser.uid);
            
    //                     const bookCol = collection(db, 'Books');
            
    //                     await addDoc(bookCol, {title, key, user, userId});
    //                     console.log('done');
    //                })
    //         )
    //     }
        
    //    }
    // }, [readLater])

    useEffect(()=>{

        function upLoadBook() {
            readLater.forEach((item)=>{
                const {title, key } = item;
                const user = auth.currentUser.email;
                const userId = auth.currentUser.uid;

                const bookCol = collection(db, 'Books');
                addDoc(bookCol, {title, key, user, userId});
                console.log('done');
            })
            
        }

        upLoadBook();
    }, [readLater])


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
                    <h5>{books[selectedId].author_name}</h5>
                    <h6>{books[selectedId].subject_facet.slice(0,3).join(', ')}</h6>
                    <div className='add-des'>
                        <div className='add-des-box'>
                            <span>Rating</span>
                            <span>{books[selectedId].ratings_average.toFixed(1)}</span>
                        </div>

                        <div className='add-des-box'>
                            <span>Want to Read</span>
                            <span>{books[selectedId].author_name}</span>
                        </div>
                    

                    </div>
                    <p> {bookData.description}</p>

                    {readLater.find((item) => item.coverImg === bookData.coverImg) ? (
                        <button className='ind-btn' disabled>Already Added</button>
                            ) : (
                        <button onClick={() => handleClick(bookData)} className='ind-btn'>Add to Reading List</button>
)}

                    
                    
                
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
}