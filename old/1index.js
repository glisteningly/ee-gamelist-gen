const fs = require('fs');
const readline = require('readline');
const { parse } = require("debian-control");

const TXT = './demo.txt'

const metaString = fs.readFileSync(TXT, 'utf8');

console.log(metaString)

const obj = parse(metaString)
console.log(obj)

