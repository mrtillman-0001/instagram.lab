require('dotenv').config();
const fs = require('fs');
const { IgApiClient } = require("instagram-private-api");

const ig = new IgApiClient();

async function login() {
  // basic login-procedure
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  return await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
}

async function postImage(path){
  const publishResult = await ig.publish.photo({
    // read the file into a Buffer
    file: fs.readFileSync(path),
    // optional
    usertags: {
      in: [
        await generateUsertagFromName('instagram', 0.5, 0.5),
      ],
    },
  });
  return Promise.resolve(buffer);
}

async function changeAvatar(path){
  const buffer = fs.readFileSync(path);
  await ig.account.changeProfilePicture(buffer);
}

/**
 * Generate a usertag
 * @param name - the instagram-username
 * @param x - x coordinate (0..1)
 * @param y - y coordinate (0..1)
 */
 async function generateUsertagFromName(name, x, y) {
  // constrain x and y to 0..1 (0 and 1 are not supported)
  x = clamp(x, 0.0001, 0.9999);
  y = clamp(y, 0.0001, 0.9999);
  // get the user_id (pk) for the name
  const { pk } = await ig.user.searchExact(name);
  return {
    user_id: pk,
    position: [x, y],
  };
}

/**
 * Constrain a value
 * @param value
 * @param min
 * @param max
 */
const clamp = (value, min, max) => Math.max(Math.min(value, max), min);

const path = "./icons/uf1gow8ne7e4-jhene-aiko.jpg";

login()
.then(() => changeAvatar(path))
.then(() => postImage(path))
.then(console.log)
.catch(console.log);