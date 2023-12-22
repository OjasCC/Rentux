# How to start locally?

(make sure you have node.js installed)
```
npm i           //to install dependencies 
npm run start   //to start local server
```
& make sure `BACKEND` variable in `.env` file is blank ( this ensures all requests are sent to / )
```
BACKEND=
```

# How does it work?

`npm run start` first executes `convert.js` ( then starts the server through `local-app.js` ) which converts all the `.ejs` files in views to single `.HTML` files and outputs them into the dist folder  (overwrites if they already exist)

> .ejs was chosen as it is easy to understand and maintain, also it provides reusability of the same code segments

These singular .HTML files are then sent when requested 

<br>

# How to update on netlify?

First change the `BACKEND` variable to
```
BACKEND=https://rentuxsample.herokuapp.com/api
```

then run `node convert.js` ( or `npm run start` if the dist folder contents don't change ) to convert the files and copy paste replace the dist folder into the repo (which already has a dist folder) and commmit the changes