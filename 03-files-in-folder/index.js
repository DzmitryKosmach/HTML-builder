const { extname, resolve } = require('path');
const { readdir } = require('fs/promises');
const  { stat }  = require('fs');

const dirNamePath = resolve(__dirname, 'secret-folder');

async function readFiles() {
  
  try {
    const files = await readdir(dirNamePath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {        
        stat(resolve(dirNamePath, file.name), (error, stats) => {
          if (error) {
            console.log(error);
          }
          else {
            let file_stat = `${file.name.split('.')[0]} - ${extname(file.name).split('.')[1]} - ${stats.size}bites`;
            console.log(file_stat);          
          }
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
  
};

readFiles();