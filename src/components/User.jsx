import { useEffect, useState } from "react";
import { getAuth,updateProfile } from "firebase/auth";
import { useNavigate,Link} from "react-router-dom"
import { updateDoc,doc} from "firebase/firestore";
import {db} from '../firbase.config'
import { toast } from "react-toastify";
export default function User() {
  //initiante getauth to get current user
  const auth = getAuth();
  //use formdata to remain consistent with other routes
  const [formdata,setFormdata] = useState({
    name : auth.currentUser.displayName,
    email : auth.currentUser.email

  });
  //state to change user settings
  const [changeDetails,setChangedetails] = useState(false);
  //destructure the name and email
  const {name,email} = formdata
  //initiate useNavigate hook
  const navigate = useNavigate()
  const onlogout = () =>{
    // use firebase inbuilt signout button
    auth.signOut()
    navigate('/')
  }
  //handle changeDetails through onSubmit
  const onSubmit = async()=>{
    try {
      if(auth.currentUser.displayName !== name){
        //update the user in firebase
        await updateProfile(auth.currentUser,{
          displayName : name
        })
        //update in firestore
        const userRef = doc(db,'users',auth.currentUser.uid)
        await updateDoc(userRef,{
          name
        })
      }
    } catch (error) {
      toast.error('Cannot change details')
      
    }
  }
  //onChange
  const onChange = (e) =>{
    setFormdata((prevState) =>({
      ...prevState,
      [e.target.id] : e.target.value
    }))
  }
  return <div className="profil">
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button type="button" className="logOut" onClick = {onlogout}>Logout</button>
    </header>
    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">
          My Details
        </p>
        <p className="changePersonalDetails" onClick = {()=>{
          changeDetails && onSubmit()
          setChangedetails((prevState) => !prevState)
        }}>
          {changeDetails ? 'Done' : 'change'}
        </p>
        </div>
        <div className="profileCard">
          <form>
            <input 
            type="text"
            id = "name"
            className= {!changeDetails ? 'profileName' : 'profileNameActive'} 
            disabled = {!changeDetails}
            value = {name}
            onChange = {onChange}
            />
            <input 
            type="text"
            id = "email"
            className= 'profileEmail'
            disabled
            value = {email}
            
            />
          </form>
        
      </div>
    </main>
  </div>
}
