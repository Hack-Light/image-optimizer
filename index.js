let { resolve, normalize, extname } = require("path");
let { promises, statSync, stat } = require("fs");
let { exec } = require("child_process");

async function* getFiles(dir) {
  const dirents = await promises.readdir(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

(async () => {
  for await (const f of getFiles(normalize(process.argv[2]))) {
    let x = extname(f);
    let { size } = statSync(f);

    console.log(`${f} has a size of ${size / 1024} Kb`);

    if (x == ".jpg" || x == ".jpeg" || x == ".JPEG" || x == ".JPG") {
      exec(`jpegoptim -m 30 --size="30%" "${f}"`, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
    if (x == ".png") {
      exec(`optipng "${f}"`, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
  }
})();
