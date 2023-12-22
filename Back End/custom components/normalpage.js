import React, { useEffect } from "react";

const NormalPage= React.memo(()=>{

    let item_data; // { item data...}
    let all_data; // { pairs:{},categories,lastID}
    let params; // urls parameters

    function Initialize(){
        params= new URLSearchParams(window.location.search); //extracts url querys

        toggle_itemfield();

        fetch('/api/data', //fetches data 
            {
                method:'POST',
                body:JSON.stringify(
                    {
                        type:'summon',
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
                all_data=JSON.parse(res_data['data']);

                setCategories();

                if(Object.keys(all_data['pairs']).length==0){
                    setItems(1);
                   return toggle_itemfield(-1)
                }
                setItems();
            
                check_valid();
        
                window.onbeforeunload = ()=>{
                    return '';
                }
            }
        });
        toggle_itemfield(1);

    }

    function toggle_itemfield(enable=0){

        let fields=document.querySelectorAll('fieldset');

        if(enable==0)
            fields.forEach(el=>{ // disables all input fields till fetch request is complete to avoid sending multiple requests
                el.setAttribute('disabled','disabled');
            });
        else if(enable==-1){
            fields.forEach(el=>{ // disables all input fields till fetch request is complete to avoid sending multiple requests
                el.setAttribute('disabled','disabled');
            });
            document.querySelector('#cat-fieldset').removeAttribute('disabled');
        }
        else
            fields.forEach(el=>{ // enables all input fields till fetch request is complete to avoid sending multiple requests
                el.removeAttribute('disabled');
            });

    }

    function saveJSON(){ // sends a fetch request to save JSON

        if(document.querySelector('#item-select').options.length==0)
            return alert('Create new Item first before saving!')

        let fields=document.querySelectorAll('fieldset');
        fields.forEach(el=>{ // disables all input fields till fetch request is complete to avoid sending multiple requests
            el.setAttribute('disabled','disabled');
        });

        toggle_itemfield();
        fetch('/api/data', //fetch request to save modified data
            {
                method:'POST',
                body:JSON.stringify(
                    {
                        type:'modify item',
                        token:params.get('token'),
                        JSON_data:{[document.querySelector('#item-select').value]:item_data}
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
                alert('Changes commited!');

                Initialize();

                fields.forEach(el=>{ //re enables everything 
                    el.removeAttribute('disabled');
                });
            }

        }).catch((err)=>{alert(`Error:${err}`);});

        toggle_itemfield(1);
    }

    function add_item(){ // adds new Item
        let item_name=prompt('Enter item name:');

        try{item_name=item_name.trim();}catch{}

        if(item_name==null||item_name=='')
            return;

        toggle_itemfield();

        fetch('/api/data', //fetches data 
            {
                method:'POST',
                body:JSON.stringify(
                    {
                        type:'add item',
                        item_name,
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
                all_data['lastID']=res_data['lastID'];

                document.querySelector('#item-cat').selectedIndex=1;
                let temp_option=document.createElement('option');
                temp_option.value=`ID${all_data['lastID']}`;
                temp_option.innerText=item_name;
                temp_option.selected=true;

                let item_sel=document.querySelector('#item-select');
                item_sel.appendChild(temp_option);
                item_sel.dispatchEvent(new Event("change"));
            }
        });
        toggle_itemfield(1);
        
    }

    function setCategories(){ //adds options into select category
    
        let cat_select=document.querySelector("#item-cat");

        while (cat_select.firstChild && !cat_select.firstChild.remove());

        let temp_op=document.createElement('option');
        temp_op.innerText='Add category';
        cat_select.appendChild(temp_op);

        for(let i=0;i<all_data['categories'].length;i++){
            let temp_op=document.createElement('option');
            temp_op.innerText=all_data['categories'][i];
            cat_select.appendChild(temp_op)
        }

    }

    function setItems(blank=0){ //inserts all item options in select
    
        let item_select=document.querySelector('#item-select');

        while (item_select.firstChild && !item_select.firstChild.remove());

        for(let key in all_data['pairs']){
            let temp_option=document.createElement('option');
            temp_option.value=key;
            temp_option.innerText=all_data['pairs'][key].substring(0,25);

            item_select.appendChild(temp_option);
        }
        
        setForm(blank);

    }

    const setForm=(blank)=>{ //sets values into the form according to current item selection

        toggle_itemfield();

        fetch('/api/data', //fetches all items data 
            {
                method:'POST',
                body:JSON.stringify({
                    type:'item',
                    from:'_all',
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

                if(blank==1)
                {
                    document.querySelector('#item-id').innerText='';
                    document.querySelectorAll('.item-wrapper textarea').forEach(el=>{
                        el.value='';
                    });
                    document.querySelectorAll('.item-wrapper input').forEach(el=>{
                        el.value='';
                        try{el.selected=false}catch{}
                    })
                }
                else{
                    let temp_item=JSON.parse(res_data['item']);
                    item_data=temp_item;
            
                    document.querySelector('#item-id').innerText=document.querySelector('#item-select').value;
                    document.querySelector('#item-title').value=temp_item['title'];

                    document.querySelector('#item-img-link').value=temp_item['img_link'];
                    document.querySelector('#item-cat').selectedIndex=all_data['categories'].indexOf(item_data['category'])+1;
            
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
            }

        })

    }

    function mod_data(val,key1,type='text'){ //modifies data to val at given key
        if(type=='text')
            item_data[key1]=val;
        else if(type=='check')
            item_data[key1]=val;
        else 
            item_data[type][key1]=val;
    }

    function del_item(){ //deletes item from data
        if(document.querySelector('#item-select').options.length==0)
        return alert('Nothing to delete!')

        let c=confirm('Are you sure you want to delete this Item?');
        if(c==true){

            toggle_itemfield();

            fetch('/api/data', //fetch request to delete item
                {
                    method:'POST',
                    body:JSON.stringify(
                        {
                            type:'delete item',
                            token:params.get('token'),
                            JSON_data:{ID:document.querySelector('#item-select').value}
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

                    Initialize()
                    toggle_itemfield(1);

                    document.querySelector('#cat-fieldset').scrollIntoView();

                }

            })
            .catch((err)=>{alert(`Error:${err}`);});

        }
    }

    const check_valid=()=>{ //silently checks the validity of the form and disabkes the submit button if invalid
        let cat_wrapper= document.querySelector('#cat-fieldset');
        if(!document.querySelector('.item-wrapper').checkValidity())
            cat_wrapper.classList.add('disabled');
        else
            cat_wrapper.classList.remove('disabled');     
    }

    useEffect(()=>{

        document.querySelector('#item-select').addEventListener('change',setForm);

        document.querySelector('#cat-fieldset').addEventListener('click',(e)=>{
            document.querySelector('form').reportValidity();
        });

        document.querySelector('#item-cat').addEventListener('change',(e)=>{
            if(e.target.value=='Add Category'){
                let cat_name=prompt('Enter category name:')
                try{cat_name=cat_name.trim();}catch{}

                if(cat_name==null||cat_name=='')
                    e.target.selectedIndex=all_data['categories'].indexOf(all_data['items'][document.querySelector('#item-select').value]['category']);

                else{
                    let temp_op=document.createElement('option');
                    temp_op.innerText=cat_name;
                    all_data['categories'].push(cat_name);
                    e.target.prepend(temp_op)
                    e.target.selectedIndex=0;
                }
            }
            item_data['category']=e.target.value;
        });

        document.querySelector('.item-wrapper').addEventListener('input',check_valid);
        
        Initialize();
          
    },[])

    console.log('Rendered Normal Page');  

    return(<div className="normal-wrapper" style={{backgroundColor:"#ccc",width:"90%",display:"flex",flexDirection:"column",flex:"1",alignItems:"center"}}>
        <fieldset id="cat-fieldset" style={{border:0,width:"100%",display:"flex",flexDirection:'column',justifyContent:"center",alignItems:"center"}}>
            <input type="button"  tabIndex="-1" onClick={saveJSON} style={{backgroundColor:'#7eb336',color:"white",borderRadius:"0.3rem",padding:"0.2rem",marginTop:"3rem"}} value="Save Current Item Changes" />
            <div className="cat-wrapper">
                <div className="breaker" style={{justifyContent:"center",display:"flex"}}>
                    <select id="item-select"  tabIndex="-1" style={{width:"10%",minWidth:"8rem"}}></select>
                    <input type="button"  tabIndex="-1" value="New Item" id="item_mod" onClick={add_item}/>
                </div>
            </div> 
        </fieldset>

        <fieldset id="item-fieldset" style={{border:0,padding:0,display:"flex",flexDirection:"column",marginBottom:"5rem"}}>
            <form onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }} onSubmit={(event)=>{ event.preventDefault();}} style={{flex:1,justifyContent:"center",alignItems:"center"}} className="item-wrapper">
                
                <label>Item ID:</label><label id="item-id" style={{color:"red"}}></label><br/>
                <label>Item Title:</label><input id="item-title" type="text" required style={{width:"10rem"}} onChange={(e)=>{mod_data(e.target.value,'title')}} /><br/>

                <label>Image Link:</label><input id="item-img-link" type="text" style={{width:"10rem"}} onChange={(e)=>{mod_data(e.target.value,'img_link')}}/><br/>

                <label>Category:</label>
                <select id="item-cat" style={{width:"10rem"}}>
                </select>
                <br/>

                <label>Info:</label><br/>
                <textarea id="item-info" style={{width:"100%",height:"5rem",resize: "none",whiteSpace: "pre",overflowWrap: "normal",overflowX: "auto"}} onChange={(e)=>{mod_data(e.target.value,'info')}}></textarea><br/>

                <label>Original Cost:</label><input id="originalcost-item" type="text" onChange={(e)=>{mod_data(e.target.value,'originalcost')}}/><br/>
                
                <label>Monthly Cost:</label>
                <input type="number" min="0" placeholder="(float)" id="monthly-item" style={{marginRight:"2rem"}} onChange={(e)=>{mod_data(e.target.value,'monthly','price')}}/>
                <br className="temp-br"/>
                <label>Monthly Sale Cost:</label>
                <input type="number" min="0" placeholder="(0 if none)" id="monthly-sale-item" onChange={(e)=>{mod_data(e.target.value,'monthly_sale','price')}}/><br/>

                <label>Weekly Cost:</label>
                <input type="number" min="0" placeholder="(float)" id="weekly-item" style={{marginRight:"2rem"}} onChange={(e)=>{mod_data(e.target.value,'weekly','price')}}/>
                <br className="temp-br"/>
                <label> Weekly Sale Cost:</label>
                <input type="number" min="0" id="weekly-sale-item" placeholder="(0 if none)" onChange={(e)=>{mod_data(e.target.value,'weekly_sale','price')}}/>
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

        <input id="del-btn" onClick={del_item} type="button" value="Delete Item" style={{display:"inline",width:"fit-content",marginBottom:"3rem",backgroundColor:'#c42727',color:"white",borderRadius:"0.3rem",padding:"0.2rem",margin:"0 auto 1rem auto"}}/>
    </div>)
});

export default NormalPage;