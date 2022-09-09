let { resolve, normalize, dirname, extname } = require("path");
let { promises } = require("fs");

async function* getFiles(dir) {
  const dirents = await promises.readdir(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    console.log(res);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield dirname(res);
    }
  }
}

(async () => {
  let arr = [];

  for await (const f of getFiles(normalize(process.argv[2]))) {
    arr.push(f);
  }

  console.log(arr);

  [...new Set(arr)].forEach(async (el) => {
    try {
      console.log(1, el);
      // run command here
    } catch (error) {
      console.log(error);
    }
  });
})();
