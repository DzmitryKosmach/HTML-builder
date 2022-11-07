const { createWriteStream } = require('fs');
const path = require('path');
const readline = require('readline');

const fileNamePath = path.resolve(__dirname, 'text.txt');
const BYE = "Bye bye!";

function writeFile() {

  process.on("SIGINT", () => { 
    console.log(BYE);
    process.exit(0);    
  })

  const writeStream = createWriteStream(fileNamePath);

  const rLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  console.log('Hello! Enter text');
  
  rLine.on('line', (line) => {
    if (line.toLowerCase() === 'exit') {
      console.log(BYE);
      rLine.close();
      writeStream.destroy();
    } else {
      writeStream.write(line + '\n');
    }
  });
  
};

writeFile();