const Discord = require('discord.js')
const client = new Discord.Client()
const ENV = require('dotenv')
const {readdir} = require('fs');

client.collectWL = new Discord.Collection()

ENV.config()


const {Query} = require('./model/Index')
const mysql = require('./model/MySQL')
mysql.connect((err) =>{
    if(err) return console.log(err)
    console.log('[MySQL] Conectado com sucesso.'+ mysql.threadId)
})

client.on("ready", () => {
  let activities = [
      `Creative V5`,
      `Feito por gunns`,
      `Oi Eu sou o gunn`
      
    ],
    i = 0;
  setInterval( () => client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "PLAYING"
      }), 4000); // tempo de trocar de stats, esta em milisegundos. 
  client.user
      .setStatus("online")
});


client.on('message', async message => {  
  if (message.author.bot) return
  if (message.channel.id !== process.env.channelWhitelist) return
  if (message.content.toLowerCase() === "!config") return 
  if (message.content.toLowerCase() === "!whitelist") return 
  message.delete()

  message.channel.send(`<@${message.member.id}> aqui **não** é um canal de bate-papo ❌\nPara realizar sua whitelist escreva \`\`!whitelist\`\``).then(e => e.delete({timeout: 5000}))
})

client.on('message', async message => {        
    if(message.author.bot) return;
    if(!message.content.startsWith(process.env.PREFIX)) return; 
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const commands = args.shift().toLowerCase();
    try{
    let commandFile = require(`./commands/${commands}.js`)
    commandFile.run(client, message, args, Discord);
        } catch (err) {
           console.log(err)
        }
    });
  
    readdir("./events/", (err, files) => {
      if (err) return console.log("[ERROR EVENT] " + err);
      files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, (...args) => eventFunction.run(client, ...args));
      });
  });
  

client.login(process.env.TOKEN)

process.on('multipleResolves', (type, reason, promise) => {
  console.log(`🚫 Erro Detectado\n\n` + type, promise, reason)
});
process.on('unhandRejection', (reason, promise) => {
  console.log(`🚫 Erro Detectado:\n\n` + reason, promise)
});
process.on('uncaughtException', (error, origin) => {
  console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});
process.on('uncaughtExceptionMonitor', (error, origin) => {
  console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});

