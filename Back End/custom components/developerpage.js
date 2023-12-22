// import React, { useEffect } from 'react';

// const DeveloperPage=React.memo(({data,params})=>{ //Loads Developer Mode

//     function saveJSON(){ //saves changes to the data

//       try {
//         let VALID_JSON = JSON.parse(document.querySelector('#changer').value);
  
//         if (VALID_JSON && typeof VALID_JSON === "object") { //checks if json is valid before sending request to change
  
//           document.querySelector('#changer_wrapper').setAttribute('disabled','disabled') //disables text area untill request is complete to avoid multiple requests
  
//           fetch('/api/data',
//             {
//               method:'POST',
//               body:JSON.stringify(
//                 {
//                   type:'modify',
//                   token:params.get('token'),
//                   JSON_data:JSON.stringify(JSON.parse(document.querySelector('#changer').value)) //extracts data from text area to send for modification
//                 }
//               )
//             }
//           )
//           .then(d=>d.json()).then(data=>{
//             if(data.valid==0) // if jwt token has expired, it redirects to main page with expiration error in url query
//               window.location.href = `/?err=expired`;
//             else{
//               alert('Changes commited!');
//               document.querySelector('#changer_wrapper').removeAttribute('disabled')

//               // location.reload();
//             }
  
//           })
//           .catch(()=>{});
//           return;
//         }
//       }
//       catch (e) {}
    
//       alert('Invalid Syntax!');
//     }
  
//     function enable_JSON_editing(){ //re enables JSON text area editing
//       document.querySelector('#changer_wrapper').removeAttribute('disabled');
//       document.querySelector('#qualified_btn').remove();
//     }
  
//     useEffect(()=>{
//       data=JSON.stringify(data, null, 4); // Formats JSON into readable form
//       document.querySelector('#changer').value=data;
//     },[]);
  
//     return(<div style={{width:"100%",height:"100%",display:'flex',justifyContent:'center',alignItems:"center",position:"relative"}}>
//         <fieldset id="changer_wrapper" disabled>
//           <span style={{justifyContent:"center",display:"flex",width:"100%",position:"relative",margin:"0 0 1rem 0",justifyContent:'center',alignItems:"center"}}>

//           <input type="button" style={{backgroundColor:'#7eb336',color:"white",borderRadius:"0.3rem",padding:"0.2rem"}} onClick={()=>{saveJSON()}} value="Save Changes" />
                    
//           </span>
//           <textarea id="changer" wrap = "off" spellCheck="false" ></textarea>
//         </fieldset>
//         <button id="qualified_btn" style={{position:"absolute",color:"white",backgroundColor:"#c42727",alignSelf:"center",borderRadius:"0.3rem",border:"solid #cccccc 1px",padding:"0.3rem",cursor:"pointer"}} onClick={enable_JSON_editing} >I'm qualified to f*ck this up</button>
//     </div>)
// });

// export default DeveloperPage;
  