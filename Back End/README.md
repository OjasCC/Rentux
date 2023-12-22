# How does it Work?

When built on heroku, it runs the command `npm run start` which executes `starting.js`. <br>

It clones the repo `Rentux-Sample/backup-data` in the current directory which contains all the data in the `DATA` folder.



> All `variables` can be changed in the `next.config.js` file 

<br>

# How to run locally?

( make sure you have node.js installed )
```
npm i        //to install dependencies ( only first time )
npm run dev  //to start server locally
```

These commands will run the server locally for testing purposes

>⚠️ **Warning :** Any changes you make to the data from the Admin page (even locally) will be reflected on the main site

<br>

# APIs

`/pages/api/data.js`: API Route to edit data from Admin page & backup to github

<br>

`/pages/api/front.js`: API Route to send data to the frontend

<br>

`/pages/api/submit.js`: API Route to receive enlisting submissions

<br>

`/pages/api/verify.js`: API Route to verify Admin login and tokens

<br>

# How is the data structured?

`_all.json` file contains all item(s) data in a structure of 

```JSON

{
   "lastID":4,
   "items":{
      "ID1":{

         "img_link": "https://i.ibb.co/PCbqK5J/1.jpg",
         "title": "The Psychology of Money",
         "info": "Author: Morgan Housel",
         "originalcost": "300 - 400",
         "price": {
               "monthly": 30,
               "monthly_sale": 0,
               "weekly": 10,
               "weekly_sale": 0
         },
         "category": "casual books",
         "outofstock": 0,
         "owner": "Untitled",
         "email": "Unknown@Untitled.com",
         "phno": "-",
         "refurl": "https://blank.org",
         "age": "0",
         "specs": ""
      },
      "ID2":{...},
      "ID3":{...},
      "ID4":{...}
   }
}

```

<br>

`_categories.json` file contains an array of all the categories
```JSON

{
   "categories":["others","casual books","electronic gadgets","engineering tools"]
}

```
> The `others` category is a default and should not to be deleted

<br>

The segregation of the files is done so that when a request is made from the front end to send it data, a file of desired request can immediately be read and sent instead of parsing a single universal file for data.

Similarly, when a request is made for a specific category a single file can be read and sent immediately<br>

A Sample `casual books.json` :

```JSON
{
	"ID3": {

      "img_link": "https://i.ibb.co/Cz3sRKH/1.jpg",
      "title": "Steve Jobs",
      "info": "Author: Walter Isaacson",
      "originalcost": "400",
      "price": {
            "monthly": 30,
            "monthly_sale": 0,
            "weekly": 10,
            "weekly_sale": 0
      },
      "category": "others",
      "outofstock": 0,
      "owner": "Untitled",
      "email": "Unknown@Untitled.com",
      "phno": "-",
      "refurl": "https://blank.org",
      "age": "0",
      "specs": ""
	},
	"ID7": {...},
	"ID15": {...},
}
```
<br>