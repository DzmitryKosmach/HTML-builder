const fs = require('fs/promises');
const { resolve, extname } = require('path');

const projectDistDir = resolve(__dirname, 'project-dist');
const indexPath = resolve(projectDistDir, 'index.html');
const templatePath = resolve(__dirname, 'template.html');
const stylesDir = resolve(__dirname, 'styles');
const stylePath = resolve(projectDistDir, 'style.css');
const assetsDirName = 'assets';
const assetsDir = resolve(__dirname, assetsDirName);
const assetsDirDest = resolve(projectDistDir, assetsDirName);
const componentsDir = resolve(__dirname, 'components');

copyDir(assetsDir, assetsDirDest);
buildFromTemplate(templatePath, componentsDir, indexPath);
mergeStyles(stylesDir, stylePath);


async function copyDir(from, to) {
 
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
      copyDir(resolve(from, file), resolve(to, file));
    }
   } 

};

async function buildFromTemplate(template, components, dest) {

  let files = await fs.readdir(components);
  let componentsMap = new Map();

  for (const file of files) { 
    fileSplitArray = file.split('.');
    if (fileSplitArray.length > 1) {

      let stats = await fs.lstat(resolve(components, file));
    
      if (stats.isFile() && fileSplitArray[fileSplitArray.length-1] == 'html') {
        let content = (await fs.readFile(resolve(components, file))).toString();
        let fileName = file.split('.')[0];
        componentsMap.set(fileName, content);
      }

    }
    
  }

  let templateString = (await fs.readFile(template)).toString();

  componentsMap.forEach((value, key) => { 
    
    templateString = templateString.replace(`{{${key}}}`, value);

  })

  fs.writeFile(dest, templateString, (err) => {
    if (err) console.log(err);    
  }); 
  
}

async function mergeStyles(stylesDir, stylePath) { 

  let files = await fs.readdir(stylesDir, { withFileTypes: true });

  let stylesArray = [];  
  
  for (const file of files) { 
    if (file.isFile && extname(file.name) == '.css') {
      let styleString = (await fs.readFile(resolve(stylesDir, file.name))).toString();
      stylesArray.push(styleString);
    }
  }
    
  for (let i = 0; i < stylesArray.length; i++) {
    if (i === 0) {
        await fs.writeFile(stylePath, stylesArray[i], (err) => {
          if (err) console.log(err);    
        }); 
        //fs.writeFileSync(stylePath, stylesArray[i]);            
      } else {
        await fs.appendFile(stylePath, stylesArray[i], (err) => { 
          console.log(err);
        })
      }    
  }

}
