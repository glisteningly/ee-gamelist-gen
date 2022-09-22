const fs = require('fs');
const readline = require('readline');
const _ = require('lodash')

// const TXT = './demo.txt'
const TXT = './demo2.txt'

const metaString = fs.readFileSync(TXT, 'utf8');

const META_KEYS = ['game', 'file', 'developer', 'publisher', 'genre', 'description', 'release', 'players', 'x-id']

// console.log(metaString)

// const splitList = metaString.split('x-id:')
const splitList = metaString.split('\r\n\r\n')
// console.log(splitList)

const gameMetaStringList = splitList.filter(str => {
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
      if (_m.length >= 2) {
        item.description += line.replace('description:', '').trim()
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

const listOptimise = (list, translateJson, descJson) => {
  // let log = ''
// 处理字段
  const out = list.map(g => {
    const _game = {}
    const rom = g.file.replace('.zip', '').trim()
    const trans = _.find(translateJson, { rom: rom })
    if (trans) {
      let cnName = trans.cn
      const index = trans.cn.indexOf('（')

      let enName = trans.en
      const index2 = trans.en.indexOf('(')

      if (index > 1) {
        cnName = cnName.substring(0, index).trim()
        enName = enName.substring(0, index2).trim()
      }
      // Object.assign(g, { game: cnName.replaceAll(' ', ''), name: enName })
      _game.game = cnName.replaceAll(' ', '')
      _game.name = enName
      //排序名称
      _game.sortBy = enName
    }

    delete g.game
    delete g.name
    delete g.description

    Object.assign(_game, g)

    const desc = _.find(descJson, { file: g.file })
    if (desc) {
      _game.description = desc.description
    }

    return _game
  })

  return out
}

const genGameListFromTxt = (path) => {
  const metaString = fs.readFileSync(path, 'utf8')
  const splitList = metaString.split('\r\n\r\n')
  const gameMetaStringList = splitList.filter(str => {
    return str.indexOf('game:') > -1
  })
  return gameMetaStringList.map(str => {
    const tempList = str.split('\r\n')
    return genSingleGame(tempList)
  })
}

const NEOGEO = require('./neogeo.json')

const outGameList = genGameListFromTxt('./demo2.txt')
const descList = genGameListFromTxt('./demo3.txt')


const gameList = listOptimise(outGameList, NEOGEO, descList)

fs.writeFileSync('./out2.json', JSON.stringify(descList, null, 2))

// console.log(gameList)

// fs.writeFileSync('./out.json', JSON.stringify(gameList, null, 2))


const genMetaTxt = (gamelist) => {
  let pegaTxt = ''
  gamelist.forEach(game => {
    let gameSec = ''
    Object.keys(game).forEach(key => {

      if (key === 'description') {
        gameSec += `description: `
        gameSec += `${game.description}\n`
      } else {
        gameSec += `${key}: ${game[key]}\n`
      }
    })
    pegaTxt += gameSec + '\r\n\r\n'
  })
  return pegaTxt
}

const outTxt = genMetaTxt(gameList)
// console.log(outTxt)

fs.writeFileSync('./out.txt', outTxt)

