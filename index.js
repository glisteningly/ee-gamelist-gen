const fs = require('fs');
const readline = require('readline');

// const TXT = './demo.txt'
const TXT = './demo2.txt'

const metaString = fs.readFileSync(TXT, 'utf8');

const META_KEYS = ['game', 'file', 'developer', 'publisher', 'genre', 'description', 'release', 'players', 'x-id']

// console.log(metaString)

// const splitList = metaString.split('x-id:')
const splitList = metaString.split('\r\n\r\n')
// console.log(splitList)

const gameMetaStringList = splitList.filter(str=>{
  return str.indexOf('game:') > -1
})

// console.log(gameMetaStringList)


const genSingleGame = (infoList) => {
  const item = {}
  let isReadingDesc = false
  infoList.forEach(line => {
    if (line.indexOf('description:') > -1) {
      isReadingDesc = true
      Object.assign(item, { description: '' })
      const _m = line.split(':')
      if (_m.length === 2) {
        item.description += _m[1].trim()
      }
    } else {
      const _m = line.split(':')
      if (_m.length === 2) {
        if (META_KEYS.includes(_m[0].trim())) {
          isReadingDesc = false
          if (item.description && item.description !== '') {
            item.description = item.description.substring(0, item.description.length)
          }
          Object.assign(item, { [_m[0].trim()]: _m[1].trim() })
        }
      } else {
        if (line.trim() !== '') {
          if (line.trim() === '.') {
            item.description += '\n  .'
          } else {
            item.description += '\n  ' + line.trim()
          }
        }
      }
    }
  })
  // console.log(JSON.stringify(item, null, 2))
  return item
}

const gameList = gameMetaStringList.map(str => {
  const tempList = str.split('\r\n')
  return genSingleGame(tempList)
})


const genMetaTxt = (gamelist) => {
  let pegaTxt = ''
  gamelist.forEach(game=>{
    let gameSec = ''
    Object.keys(game).forEach(key=>{
      if (key === 'description') {
        gameSec += `description:`
        gameSec += `${game.description}\n`
      } else {
        gameSec += `${key}: ${game[key]}\n`
      }
    })
    //排序名称
    gameSec += `sort_title: ${game.game}`
    pegaTxt += gameSec + '\r\n\r\n'
  })
  return pegaTxt
}

const outTxt = genMetaTxt(gameList)
// console.log(outTxt)

fs.writeFileSync('./out.txt', outTxt)

