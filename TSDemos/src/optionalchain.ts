import * as readline from 'node:readline'; // Use node: prefix for built-in modules

import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

let cname:string|null = null;


rl.question(`What's your name? `, (name) => {
  console.log(`Hi -----${name}----!`);
  const value = name.trim() === "" ? null : name;
  cname = value;
  console.log(cname, cname?.toUpperCase());
  rl.close();
});


rl.on('close', () => {
  process.exit(0);
});