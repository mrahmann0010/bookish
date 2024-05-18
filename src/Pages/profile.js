
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, 
  signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router";
import { collection, getDocs } from "@firebase/firestore";


export default function Later({user, setUser}) {


  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const toggleSignIn = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSignUp = (e)=> {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
    .then((cred)=>{
      
    })
    .catch ((err)=> {
      console.log(err.message);
    })
  }

  const handleSignIn = (e)=> {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
    .then((cred)=>{
      console.log('User Logged in');
      navigate('/')

    })
    .catch((err)=>{
      console.log(err.message);
    })
    
  }

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        console.log('sign out');
      })
      .catch((err) => {
        console.log(err.message);
      });
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  
    return () => {
      unsubscribe(); // Cleanup function to remove the listener when component unmounts
    };
  }, []);

  const postCol = collection(db, 'Books')


  useEffect(() => {
    const getPost = async () => {
      try {
        const querySnapshot = await getDocs(postCol);
        const data = querySnapshot.docs.map(doc => doc.data());
        console.log(data);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };
  
    getPost();
  }, []);


  return (
    <div>

      {user?

      <LandingPage handleSignOut={handleSignOut} name={name} setName={setName}/>

      :

      <div className="profile-container">
      <h2>Get Started!</h2>
      <div className="toggle-container">
        <button className={isSignIn ? 'active' : ''} onClick={toggleSignIn}>Sign In</button>
        <button className={!isSignIn ? 'active' : ''} onClick={toggleSignIn}>Sign Up</button>
      </div>
      <div className="form-container">
        {isSignIn ? (
          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <input
              onChange={(e)=> setEmail(e.target.value)}
              type="email" id="email" name="email" required value={email}/>
              <label htmlFor="email">Email</label>
            </div>
            <div className="form-group">
              <input
              onChange={(e)=> setPassword(e.target.value)}
              type="password" id="password" name="password" required value={password}/>
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit">Sign In</button>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <input
              onChange={(e)=> setEmail(e.target.value)}
              type="email" id="email" name="email" required value={email}/>
              <label htmlFor="email">Email</label>
            </div>
            <div className="form-group">
              <input 
              onChange={(e)=> setPassword(e.target.value)}
              type="password" id="password" name="password" required value={password}/>
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit">Sign Up</button>
          </form>
        )}
      </div>
      </div>
      
      }

    </div>
  );
};


function LandingPage({handleSignOut, handleText, name, setName}) {


  return(
    <div className='landing'>
      <div className="profile-container signedIn">
         <h2>Hello!</h2>
       <div className="toggle-container-copy">
         <p>{auth.currentUser.email}</p>
       </div>

       <p>Manage your library in once place</p>
       <button onClick={handleSignOut}>Sign Out</button>
       </div>

    </div>
  )
};