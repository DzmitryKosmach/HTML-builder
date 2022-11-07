const fs = require('fs');
const  { readdir }  = require('fs/promises');
const { extname, resolve } = require('path');

const stylesDir = resolve(__dirname, 'styles');
const bundleFilePath = resolve(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() { 

  let files = await readdir(stylesDir, { withFileTypes: true });

  let stylesArray = [];  
  
  for (const file of files) { 
    if (file.isFile && extname(file.name) == '.css') {       
      stylesArray.push(fs.readFileSync(resolve(stylesDir, file.name), 'utf8'));
    }
  }
    
  for (let i = 0; i < stylesArray.length; i++) {
    if (i === 0) {
        fs.writeFileSync(bundleFilePath, stylesArray[i]);            
      } else {
        fs.appendFileSync(bundleFilePath, stylesArray[i], (error) => { 
          console.log(error);
        })
      }    
  }

}

mergeStyles();