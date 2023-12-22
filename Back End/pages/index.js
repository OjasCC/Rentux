// AKA. Login Page
import React, { useEffect } from 'react';

export default function Index() {

  function checkPassword(){ // makes a fetch request to check if entered password if correct & if password is correct returns a JWT token which is valid for 1hr
      
    let pass=document.querySelector('#password');
    let incorrect=document.querySelector('#incorrect');

    pass.setAttribute('disabled','disabled'); //disables password input untill fetch request is complete to avoid sending multiple requests

    fetch('/api/verify',
      { //request structure
        method:'POST',
        body:JSON.stringify(
          {
            type:'password',
            pass:pass.value
          }
        )
      } //
    )
    .then(d=>d.json()).then(data=>{
      if(data.valid==1){ //if password was correct
        window.location.href = `/admin?token=${data.token}`; //redirects from login page to admin page
        incorrect.innerText='\u00A0'; //non break space for visual purposes
      }
      else{
        incorrect.innerText='Incorrect Password, try again!';
        
        if(pass.value!==''){
          pass.removeAttribute("required"); // "[!] Please fill in this field" notification if password was entered blank
          pass.value='';
        }
      }
    })
    .catch(()=>{
      incorrect.innerText='Error connecting to server, Try again or contact developer';
    })
    .finally(()=>{
      pass.removeAttribute('disabled'); //renable password input field once fetch request is complete
      pass.focus();
    });

  }

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search); //extracts URL querys

    if(params.has('err'))
      if(params.get('err')==='expired') //if any modifications were made on the Admin page after expiration of JWT token it redirects to Login page with expiration warning in url query
       document.querySelector('#incorrect').innerText='Session Expired (valid only for 1hr)';
    
    document.querySelector('#password').focus();
  },[]);

  return (<>
  <title>Login Page</title>
  <div className="password_wrapper" onClick={()=>{document.querySelector('#password').focus()}}>
    <label>Enter Password :</label>
    <form onSubmit={e=>{checkPassword();document.querySelector('#password').setAttribute("required",'required');e.preventDefault()}}>
      <input type="password" id="password" required></input>
    </form>
    <div id="incorrect" style={{color:"red",marginTop:'1rem'}}>&nbsp;</div>
  </div>
</>);
}