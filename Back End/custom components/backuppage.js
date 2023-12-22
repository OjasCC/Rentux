import React from 'react';

const BackupPage=React.memo(()=>{

    const backup=()=>{
        fetch('/api/data', //fetch request to create backup of data
        {
            method:'POST',
            body:JSON.stringify(
                {
                    type:'backup',
                    token:(new URLSearchParams(window.location.search)).get('token'),
                }
            )
        }
        )
        .then(d=>d.json()).then(_data=>{
            if(_data.valid==0){ // if jwt token has expired, it redirects to main page with expiration error in url query
                window.onbeforeunload='';
                window.location.href = `/?err=expired`;
            }
            else{
                alert('Everything has been backed up! \n (old Back up versions can be seen on github)');
            }

        })
        .catch((err)=>{alert(`Backup Failed!\nError for Nerds:${err}`);});
    }
  
    return(<div style={{width:"100%",height:"100%",display:'flex',justifyContent:'center',flexDirection:"column",alignItems:"center",position:"relative"}}>
        <input type="button" value="Backup Now" style={{cursor:"pointer"}} onClick={backup}/><br/>
    </div>)
});

export default BackupPage;
  