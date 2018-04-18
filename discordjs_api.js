const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login('MjM5ODM1NzY4MzAwNzY1MTg0.DbkKeQ.qblduMJRHJWgyH_9um5hwKJUqVA');