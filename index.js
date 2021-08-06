/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-plusplus */

/* eslint-disable no-console */
/* eslint-disable no-undef */


const fetch = require('node-fetch');
const fs = require('fs');
const { PYLON_TOKEN, GUILD_ID } = require('./config');
const pylonId = "270148059269300224";

const defaultMainText = '/*\n\tHi, the code running on this server\'s pylon instance is the PyBoat bundle from https://github.com/weebsquad/pyboat-deploy\n\tPublishing code on this editor will get rid of the current running code.\n\n\n\tIf you need support, feel free to join https://discord.gg/ehtaU3d\n\n*/';
const pylonApiBase = 'https://pylon.bot/api/';


async function getDeployment(gid) {
  if (!gid || (typeof gid === 'string' && gid.length < 2)) {
    return null;
  }
  const res = await fetch(`${pylonApiBase}guilds/${gid}`, {
    method: 'GET',
    headers: {
      'authorization': PYLON_TOKEN,
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', // lol
    } });
    const txt = await res.text();
    if (txt === 'unauthorized') {
      throw new Error('Pylon Token Unauthorized');
    }
  const json = JSON.parse(txt);
  return json.deployments;
}


getDeployment(GUILD_ID).then(async (dep) => {
  if (!dep) {
    throw new Error('Failed to fetch deployment IDs');
  }
  dep = dep.find((dp) => !dp.disabled && dp.bot_id === pylonId && dp.guild_id === GUILD_ID);
  if (!dep) {
    throw new Error('Failed to fetch deployment ID for this guild');
  }
  const bundle = fs.readFileSync('bundle.js', 'utf8');

  if (!bundle) {
    console.error('Failed to fetch bundle, exiting...');
    process.exit(1);
  }
  const data = {
    method: 'POST',
    headers: {
      'Authorization': PYLON_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      script: {
        contents: bundle,
        project: {
          files: [{ path: '/main.ts', content: defaultMainText }],
        },
      },
    })
  };
  const r = await fetch(`https://pylon.bot/api/deployments/${dep.id}`, data);
  try {
    const obj = await r.json();
    if (typeof (obj.msg) === 'string') {
      console.error(`Publish error: ${obj.msg}`);
      process.exit(1);
    } else {
      console.info(`Published to ${obj.guild.name} (${obj.guild.id}) successfully (Revision ${obj.revision})! `);
    }
  } catch (e) {
    console.error(`Publish error: ${r.url} > ${r.status} - ${r.statusText}`);
    const txt = await r.text();
    console.error(txt);
    process.exit(1);
  }
}).catch((e) => {
  console.error(`Deploy error:\n${e}`);
  process.exit(1);
});
