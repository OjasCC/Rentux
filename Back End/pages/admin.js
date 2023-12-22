//AKA Admin Page
import React, { useEffect, useState } from 'react';
import Navbar from '../custom components/navbar';

export default function Admin(){

  const [currentPage,setCurrentPage]=useState(()=><div>Loading...</div>);
  const [nav,setNav]=useState(()=><></>);

  useEffect(()=>{
    let params = new URLSearchParams(window.location.search); //extracts URL querys
    if(params.has('token')) //if jwt token in present in url query
      fetch('/api/verify', //checks if JSON token is valid
        {
          method:'POST',
          body:JSON.stringify(
            {
              type:'token',
              token:params.get('token') //extracts jwt token from url query
            }
          )
        }//
      )
      .then(d=>d.json()).then(data=>{
  
        if(data.valid==0) // if token has expired then redirects to Login Page with ecpired error
          window.location.href = `/?err=expired`;
        else
          setNav(<Navbar setCurrentPage={setCurrentPage}/>); //if password is valid it loads the page
      });
    else
      window.location.href='/'; //if there is no jwt token in URL query then redirects back to Login Page
  },[]);

  return(<>
  <title>Admin Page</title>
  {nav}
  {currentPage}</>);
}