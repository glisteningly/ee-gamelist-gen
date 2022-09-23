const fs = require('fs');
const _ = require('lodash')
const path = require("path")

const mediaFolder = `D:\\Game\\Emu\\PegasusRoms\\GBA\\media`
const boxFolder = `C:\\temp\\GBA_boxart`

const genBoxList = (entry) => {
  const dirInfo = fs.readdirSync(entry);
  return dirInfo.map(item => {
    // const location = path.join(entry, item)
    return item
  })
}

// console.log(genBoxList(boxFolder))

const readDir = (entry) => {
  const dirInfo = fs.readdirSync(entry);
  let count = 0
  dirInfo.forEach(item => {
    // console.log(item)
    const r = _.find(boxList, (b)=>{
      return b.includes(item)
    })

    if (r) {
      console.log(item)
      fs.copyFile(path.join(boxFolder, r), path.join(mediaFolder, item, 'boxfront.png'), function (err) {
        if (err){
          console.log('An error occured while copying the folder.')
          return console.error(err)
        }
      });
      count += 1
    }
  })

  console.log(`总计：${count}`)
}

// const boxList = genBoxList(boxFolder)
// readDir(mediaFolder)

const clearDir = (entry) => {
  const dirInfo = fs.readdirSync(entry);
  dirInfo.forEach(item => {
    const _location = path.join(entry, item)
    const mediaInfo = fs.readdirSync(_location);
    mediaInfo.forEach(pic=>{
      // console.log(pic)
      if (pic === 'boxfront.png') {
        fs.rename(path.join(_location, 'boxfront.jpg'),  path.join(_location, 'boxfront_us.jpg'), function (err) {
          if (err) throw err;
          // console.log('File Renamed.');
        });
      }
    })
  })
}

clearDir(mediaFolder)