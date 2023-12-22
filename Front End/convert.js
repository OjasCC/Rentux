const ejs=require('ejs')
const fs=require('fs')
const path=require('path')
require('dotenv').config()

const restricted_pages=['_common'];
fs.rmSync(`${__dirname}/${process.env.CONVERT_FOLDER}`,{ recursive: true });
fs.mkdirSync(`${__dirname}/${process.env.CONVERT_FOLDER}`);
function ejs2html({ path, outPath, data, options }) {
    fs.readFile(path, "utf8", function(err, data) {
      if (err) {
        console.log(err);
        return false;
      }
      ejs.renderFile(path, data, options, (err, html) => {
        if (err) {
          console.log(err);
          return false;
        }
        fs.writeFile(outPath, html, function(err) {
          if (err) {
            console.log(err);
            return false;
          }
          return true;
        });
      });
    });
}

fs.readdirSync(`${__dirname}/views/`).forEach(file => {
    if(path.extname(file)==''&&!restricted_pages.includes(file))
      ejs2html({
       path: `${__dirname}/views/${file}/${file}.ejs`,
       outPath: `${__dirname}/${process.env.CONVERT_FOLDER}/${file}.html`
       });
});