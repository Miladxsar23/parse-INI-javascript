const {readFile} = require("fs").promises;
const path = require('path');
//ini parser
function parseINI(str) {
  let result = {}
  let section = result;
  str.split(/\r?\n/).forEach((line, index) => {
    let match;
    if(match = /^(\w*?)=(.*?)$/.exec(line)) {
      section[match[1]] = match[2]
    }
     else if(match = /^\[(\w+)\]$/.exec(line)) {
      section = result[match[1]]={};
    }else if(!/^\s*(;.*)?$/.test(line)) {
    	throw new Error(`line ${index} is not valid`)
    }
  })
  return result
}

async function parser(pathname) {
	let res, file;
	try {
		if(path.extname(pathname).toLowerCase() !== ".ini") throw 'file format incorrect';
		file = await readFile(pathname, "utf8");
		res = parseINI(file);
	}catch(e) {
		if(e.code === "ENOENT") return "file not exist"
		else throw e;
	}
	return res;
}

exports.parsIni = parser;
parser(process.argv[2]).then(res => console.log(res), failure => console.log(failure))
