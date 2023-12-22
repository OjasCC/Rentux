import React, { useEffect, useState } from "react";

const CompletePage= React.memo(()=>{

    const NothingPage=React.memo(()=>{
        return(<div style={{margin:"auto",color:"#606060"}}>Nothing is currently pending</div>)
    });

    const PendingPage= React.memo(()=>{

        let item_data; // {"title":"",..}
        let pending_data; // { pairs:{},categories,lastID}
        let params; // urls parameters

        function Initialize(){
            params= new URLSearchParams(window.location.search); //extracts url querys

            fetch('/api/data', //fetches data 
                {
                    method:'POST',
                    body:JSON.stringify(
                        {
                            type:'pending',
                            token:params.get('token')
                        }
                    )
                }
            )
            .then(d=>d.json()).then(res_data=>{ //response_data

                if(res_data.valid==0){ // if jwt token has expired, it redirects to main page with expiration error in url query
                    window.onbeforeunload='';
                    window.location.href = `/?err=expired`;
                }
                else{
                    pending_data=JSON.parse(res_data['data']);
                
                    if(Object.keys(pending_data['pairs']).length==0)
                        setInnerPage(<NothingPage/>);
                    else{
                        setCategories();
                        setItems();
                        check_valid();
                
                        window.onbeforeunload = ()=>{
                        return '';
                        }
                    }
    
                    
                    window.onbeforeunload = ()=>{
                        return '';
                    }
                }
            });
        }

        function toggle_itemfield(enable=0){

            let fields=document.querySelectorAll('fieldset');

            if(enable==0)
                fields.forEach(el=>{ // disables all input fields till fetch request is complete to avoid sending multiple requests
                    el.setAttribute('disabled','disabled');
                });
            else
                fields.forEach(el=>{ // enables all input fields till fetch request is complete to avoid sending multiple requests
                    el.removeAttribute('disabled');
                });

        }
    
        const approve=()=>{ // sends current Item for approval

            toggle_itemfield();
            // console.log(item_data)
    
            fetch('/api/data', //fetch request to save modified data
                {
                    method:'POST',
                    body:JSON.stringify(
                        {
                            type:'approve pending',
                            token:params.get('token'),
                            JSON_data:item_data,
                            UD:document.querySelector('#item-select').value
                        }
                    )
                }
            )
            .then(d=>d.json()).then(res_data=>{
                if(res_data.valid==0){ // if jwt token has expired, it redirects to main page with expiration error in url query
                    window.onbeforeunload='';
                    window.location.href = `/?err=expired`;
                }
                else{
                    alert('Approve commited!');
    
                    if(Initialize()==0)
                        return;
    
                    toggle_itemfield(1)
                }
    
            })
            .catch((err)=>{alert(`Error:${err}`);});
                
        }
    
        function mod_data(val,key1,type='text'){ //modifies data to val at given key
            if(type=='text')
                item_data[key1]=val;
            else if(type=='check')
                item_data[key1]=val;
            else 
                item_data[type][key1]=val;
            // console.log(item_data);
        }
            
        function setCategories(){ //adds options into select category
    
            let cat_select=document.querySelector("#item-cat");
    
            while (cat_select.firstChild && !cat_select.firstChild.remove());

            let temp_op=document.createElement('option');
            temp_op.innerText='Add category';
            cat_select.appendChild(temp_op)
    
            for(let i=0;i<pending_data['categories'].length;i++){
                let temp_op=document.createElement('option');
                temp_op.innerText=pending_data['categories'][i];
                cat_select.appendChild(temp_op)
            }

        }
    
        function setItems(){ //inserts all item options in select
    
            let item_select=document.querySelector('#item-select');
    
            while (item_select.firstChild && !item_select.firstChild.remove());
    
            for(let key in pending_data['pairs']){
                let temp_option=document.createElement('option');
                temp_option.value=key;
                temp_option.innerText=pending_data['pairs'][key].substring(0,25);
    
                item_select.appendChild(temp_option);
            }
    
            setForm();
    
        }
    
        const setForm=()=>{ //sets values into the form according to current item selection

            toggle_itemfield();

            fetch('/api/data', //fetches item data 
                {
                    method:'POST',
                    body:JSON.stringify({
                        type:'item',
                        from:'_pending',
                        ID:document.querySelector('#item-select').value,
                        token:params.get('token')
                    })
                }
            )
            .then(d=>d.json()).then(res_data=>{ //response_data

                if(res_data.valid==0){ // if jwt token has expired, it redirects to main page with expiration error in url query
                    window.onbeforeunload='';
                    window.location.href = `/?err=expired`;
                }
                else{
                    let temp_item=JSON.parse(res_data['item']);
                    item_data=temp_item;
            
                    document.querySelector('#item-id').innerText=document.querySelector('#item-select').value;
                    document.querySelector('#item-title').value=temp_item['title'];

                    document.querySelector('#item-img-link').value=temp_item['img_link'];
                    document.querySelector('#item-cat').selectedIndex=1
            
                    document.querySelector('#item-info').value=temp_item['info'];
                    document.querySelector('#originalcost-item').value=temp_item['originalcost'];
                    document.querySelector('#monthly-item').value=temp_item['price']['monthly'];
                    document.querySelector('#monthly-sale-item').value=temp_item['price']['monthly_sale'];
                    document.querySelector('#weekly-item').value=temp_item['price']['weekly'];
                    document.querySelector('#weekly-sale-item').value=temp_item['price']['weekly_sale'];
                    document.querySelector('#item-stock').checked=temp_item['outofstock']==1?true:false;
            
                    document.querySelector('#owner-name').value=temp_item['owner'];
                    document.querySelector('#owner-email').value=temp_item['email'];
                    document.querySelector('#owner-phno').value=temp_item['phno'];
                    document.querySelector('#original').value=temp_item['refurl'];
                    document.querySelector('#age').value=temp_item['age'];
                    document.querySelector('#owner-specs').value=temp_item['specs'];

                    toggle_itemfield(1);
                }

            })
    
        }

    
        const check_valid=()=>{ //silently checks the validity of the form and disabkes the submit button if invalid
            let cat_wrapper= document.querySelector('.cat-fieldset');
            if(!document.querySelector('.item-wrapper').checkValidity())
                cat_wrapper.classList.add('disabled');
            else
                cat_wrapper.classList.remove('disabled');     
        }
    
        function del_item(){ //deletes item from data
    
            let c=confirm('Are you sure you want to delete this Item?');
            if(c==true){

                toggle_itemfield();
    
                fetch('/api/data', //fetch request to save modified data
                    {
                        method:'POST',
                        body:JSON.stringify(
                            {
                                type:'delete pending',
                                token:params.get('token'),
                                JSON_data:{UD:document.querySelector('#item-select').value}
                            }
                        )
                    }
                )
                .then(d=>d.json()).then(res_data=>{
                    if(res_data.valid==0){ // if jwt token has expired, it redirects to main page with expiration error in url query
                        window.onbeforeunload='';
                        window.location.href = `/?err=expired`;
                    }
                    else{
                        alert('Deleted Item!');

                        if(Initialize()==0){
                            return;
                        }
    
                        document.querySelector('.cat-fieldset').scrollIntoView();

                        toggle_itemfield(1);
                    }
    
                })
                .catch((err)=>{alert(`Error:${err}`);});
    
            }
        }
    
        useEffect(()=>{
            
            document.querySelector('#item-select').addEventListener('change',setForm);
    
            document.querySelector('.cat-fieldset').addEventListener('click',(e)=>{
                document.querySelector('form').reportValidity();
            });
    
            document.querySelector('#item-cat').addEventListener('change',(e)=>{

                if(e.target.value=='Add category'){
                    let cat_name=prompt('Enter category name:');
                    try{cat_name=cat_name.trim();}catch{}
    
                    if(cat_name==null||cat_name=='')
                        e.target.selectedIndex=categories.indexOf(item_data['category']);
                    
                    else{
                        let temp_op=document.createElement('option');
                        temp_op.innerText=cat_name;
                        e.target.prepend(temp_op)
                        e.target.selectedIndex=0;
                    }
                }
                item_data['category']=e.target.value;
            });
    
            document.querySelector('.item-wrapper').addEventListener('input',check_valid);
    
            Initialize();
        },[])
    
        return(<>
            <fieldset className="cat-fieldset" style={{border:0,width:"100%",display:"flex",flexDirection:'column',justifyContent:"center",alignItems:"center"}}>
                <input type="button"  tabIndex="-1" onClick={approve}  style={{backgroundColor:'#7eb336',color:"white",borderRadius:"0.3rem",padding:"0.2rem",marginTop:"3rem"}} value="Approve current Item" />
                <div className="cat-wrapper">
                    <div className="breaker" style={{justifyContent:"center",display:"flex"}}>
                        <select id="item-select"  tabIndex="-1" style={{width:"10%",minWidth:"8rem"}}></select>
                    </div>
                </div> 
            </fieldset>
    
            <fieldset id="item-fieldset" style={{border:0,padding:0,display:"flex",flexDirection:"column",marginBottom:"5rem"}}>
                <form onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }} onSubmit={(event)=>{ event.preventDefault();}} style={{flex:1,justifyContent:"center",alignItems:"center"}} className="item-wrapper">
                    
                    <label>Unordered ID:</label><label id="item-id" style={{color:"red"}}></label><br/>
                    <label>Item Title:</label><input id="item-title" type="text" required style={{width:"10rem"}} onChange={(e)=>{mod_data(e.target.value,'title')}} /><br/>
    
                    <label>Image Link:</label><input id="item-img-link" type="text" style={{width:"10rem"}} onChange={(e)=>{mod_data(e.target.value,'img_link')}}/><br/>
    
                    <label>Category:</label>
                    <select id="item-cat" style={{width:"10rem"}}></select>
                    <br/>
    
                    <label>Info:</label><br/>
                    <textarea id="item-info" style={{width:"100%",height:"5rem",resize: "none",whiteSpace: "pre",overflowWrap: "normal",overflowX: "auto"}} onChange={(e)=>{mod_data(e.target.value,'info')}}></textarea><br/>
    
                    <label>Original Cost:</label><input id="originalcost-item" type="text" onChange={(e)=>{mod_data(e.target.value,'originalcost')}}/><br/>
                    
                    <label>Monthly Cost:</label>
                    <input required type="number" min="0" placeholder="(float)" id="monthly-item" style={{marginRight:"2rem"}} onChange={(e)=>{mod_data(e.target.value,'monthly','price')}}/>
                    <br className="temp-br"/>
                    <label>Monthly Sale Cost:</label>
                    <input required type="number" min="0" placeholder="(0 if none)" id="monthly-sale-item" onChange={(e)=>{mod_data(e.target.value,'monthly_sale','price')}}/><br/>
    
                    <label>Weekly Cost:</label>
                    <input required type="number" min="0" placeholder="(float)" id="weekly-item" style={{marginRight:"2rem"}} onChange={(e)=>{mod_data(e.target.value,'weekly','price')}}/>
                    <br className="temp-br"/>
                    <label> Weekly Sale Cost:</label>
                    <input required type="number" min="0" id="weekly-sale-item" placeholder="(0 if none)" onChange={(e)=>{mod_data(e.target.value,'weekly_sale','price')}}/>
                    <br/>
                    <label>Out of Stock?:</label><input id="item-stock" type="checkbox" style={{width:"auto"}} onChange={(e)=>{mod_data(e.target.checked==true?1:0,'outofstock','check')}}/><br/>
    
                    <fieldset style={{padding:"1rem",marginTop:"5rem"}}>
                        <legend style={{color:"#636363"}}>Private info</legend>
                        <label>Owner Name:</label><input id="owner-name" type="text" required style={{width:"10rem"}} onChange={(e)=>{mod_data(e.target.value,'owner')}} /><br/>
                        <label>Owner E-mail:</label><input id="owner-email" type="email" required style={{width:"10rem"}} onChange={(e)=>{mod_data(e.target.value,'email')}}  /><br/>
                        <label>Phone Number:</label><input id="owner-phno" type="text" required style={{width:"10rem"}} onChange={(e)=>{mod_data(e.target.value,'phno')}} /><br/>
    
                        <label>Link to Original:</label><input id="original" type="url" required style={{width:"10rem"}} onChange={(e)=>{mod_data(e.target.value,'refurl')}} /><br/>
                        <label>Ownership Age (in months):</label><input id="age" type="number" required style={{width:"5rem"}} onChange={(e)=>{mod_data(e.target.value,'age')}} /><br/>
    
                        <label>Additional specifications:</label><br/>
                        <textarea id="owner-specs" style={{width:"100%",height:"5rem",resize: "none",whiteSpace: "pre",overflowWrap: "normal",overflowX: "auto"}} onChange={(e)=>{mod_data(e.target.value,'specs')}} ></textarea><br/>
                    </fieldset>
                </form>
            </fieldset>
    
            <input id="del-btn"  type="button" onClick={del_item} value="Delete" style={{display:"inline",width:"fit-content",marginBottom:"3rem",backgroundColor:'#c42727',color:"white",borderRadius:"0.3rem",padding:"0.2rem",margin:"0 auto 1rem auto"}}/>   
        </>)
    });

    const [innerPage,setInnerPage]=useState(<></>)

    useEffect(()=>{
        setInnerPage(<PendingPage/>);
    },[])

    return(<div className="normal-wrapper" style={{backgroundColor:"#ccc",width:"90%",display:"flex",flexDirection:"column",flex:"1",alignItems:"center"}}>
        {innerPage}
    </div>)
});

export default CompletePage;