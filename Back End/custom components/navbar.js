import React, { useEffect } from "react";
// import DeveloperPage from './developerpage';
import NormalPage from './normalpage';
import PendingPage from './pendingpage';
import BackupPage from './backuppage';

const Navbar= React.memo(({setCurrentPage})=>{

    console.log('rendered Nav')

    useEffect(()=>{
        let params= new URLSearchParams(window.location.search); //extracts url querys

        fetch('/api/verify', //verifies if the token is valid
            {
                method:'POST',
                body:JSON.stringify(
                    {
                        type:'token',
                        token:params.get('token')
                    }
                )
            }
        )
        .then(d=>d.json()).then(_data=>{
           
          if(_data.valid==0) 
            window.location.href = `/?err=expired`; //if JWT token has expired then redirects to Login page with expiration warning in url query
          else{
            
            setCurrentPage(<PendingPage />);

            document.querySelector('#mode').addEventListener('change',(e)=>{ //if switching to developer mode

                if(e.target.value=='Edit')
                    setCurrentPage(<NormalPage />);
                else if(e.target.value=='Back Up')
                    setCurrentPage(<BackupPage />);
                // else if(e.target.value=='Developer')
                // setCurrentPage(<DeveloperPage />);
                else
                    setCurrentPage(<PendingPage />);

            });
          }
        })

    },[]);

    return(<div style={{backgroundColor:"black",width:"100%",display:"flex",color:"white",clear:"both"}}>
        <style>{'@media (max-width: 600px) { .master_span{font-size:x-small !important;}}}'}</style>
        <h1 style={{color: "white",margin: "0 0 0 1rem"}}>Rentux</h1><span style={{fontSize:"small",color:"lime"}} className='master_span'>Master Control</span>
        <span style={{marginLeft: "auto",alignSelf:"center",marginRight:"1rem"}}>Mode:
            <select id="mode" style={{marginLeft: "0.5rem",alignSelf:"center",padding:"0 0.3rem"}}>
            <option>Pending</option>
            <option>Edit</option>
            <option>Back Up</option>
            {/* <option>Developer</option> */}
            </select>
        </span>
    </div>);
});

export default Navbar;