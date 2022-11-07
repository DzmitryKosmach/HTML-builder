const { createReadStream } = require('fs');
const path = require('path');

const fileNamePath = path.resolve(__dirname, 'text.txt');

exports = readFile = () => {

  const readStream = createReadStream(fileNamePath);
  readStream.on("open", () => {    
    readStream.pipe(process.stdout);
  });
  
};

readFile();