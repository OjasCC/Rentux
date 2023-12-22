const git = require('simple-git')();
const fs= require('fs');

const { spawn } = require( 'child_process' );
let next_process=require('./next.config.js');

// This initializes Name & Email 
// If not declared it does not allow commiting (ERR: " *** please tell me who you are " )
let email_cmd = spawn('git',[`config`, `--global`,`user.email`,`"${next_process.env.git.EMAIL}"`]); //to set Email
let name_cmd = spawn('git',[`config`, `--global`,`user.name`,`"${next_process.env.git.USER}"`]); //to set Name
// //

name_cmd .on( 'close', ( exitcode ) => { //after setting name and email

    const remote = `https://${next_process.env.git.USER}:${next_process.env.git.PASS}@${next_process.env.git.REPO}`; //link to repo

    if(fs.existsSync(next_process.env.GIT_DIR)) // Removes directory if it already exists prehand
        fs.rmSync(next_process.env.GIT_DIR, {recursive: true});

    // function which clones the repo
    git.clone(remote).then(() =>{console.log('finished cloning repo');}).catch((err) => console.error('failed: ', err));
});