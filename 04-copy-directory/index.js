const  fs  = require('fs/promises');
const { resolve } = require('path');

const folder = resolve(__dirname, 'files');
const destFolder = resolve(__dirname, 'files-copy');

async function copy(from, to) {
 
  const isDirExists = await fs.stat(to)
    .then(() => true)
    .catch(() => false);
  
  if (isDirExists) {
    await fs.rm(to, { recursive: true });
  }
    
  fs.mkdir(to, { recursive: true }, (err) => {
    if (err) {
        return console.error(err);
    }   
  });
  
  let files = await fs.readdir(from);

  for (const file of files) { 
    let stats = await fs.lstat(resolve(from, file));
    
    if (stats.isFile()) {
      fs.copyFile(resolve(from, file), resolve(to, file));
    } else {
      copy(resolve(from, file), resolve(to, file));
    }
   } 

};

copy(folder, destFolder);

