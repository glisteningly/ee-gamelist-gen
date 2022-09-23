const fs = require('fs');
const readline = require('readline');

const TXT = 'D:\\Game\\pegasus\\list.txt'

const rl = readline.createInterface({
  input: fs.createReadStream(TXT),
  crlfDelay: Infinity
});

const list = []
let item

const keys = ['game', 'file', 'description']

async function processLineByLine() {
  const fileStream = fs.createReadStream(TXT);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // 使用 crlfDelay 选项将 input.txt 中的所有 CR LF 实例（'\r\n'）识别为单个换行符。

  for await (const line of rl) {
    // txt 中的每一行在这里将会被连续地用作 `line`。
    keys.forEach(key => {
      const _index = line.indexOf(key + ': ')
      if (_index >= 0) {
        const val = line.slice(key.length + 1, line.length).trim()
        if (key === 'game') {
          item = {}
        }
        console.log(key)
        if (item) {
          Object.assign(item, { [key]: val })
        }

        if (key === 'description') {
          list.push(item)
        }
      }
    })
  }
  console.log(list)
}

processLineByLine()



