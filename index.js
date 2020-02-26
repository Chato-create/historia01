
const Discord = require("discord.js");


const client = new Discord.Client();

const config = require("./config.json");

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`with otouto chan`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => { 
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return; 
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("maaf anda tidak bisa menggunakan command ini!");
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("silakan mention dengan benar");
    if(!member.kickable) 
      return message.reply("aku tidak bisa kick orang ini");
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "tidak ada alasan";
    
    await member.kick(reason)
      .catch(error => message.reply(`maaf ${message.author} anda di kick karena : ${error}`));
    message.reply(`${member.user.tag} telah kick ${message.author.tag} karena: ${reason}`);
  }
  
  if(command === "ban") {
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("maaf anda tidak bisa menggunakan command ini");
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("silakan mention dengan benar");
    if(!member.bannable) 
      return message.reply("tidak bisa ban orang ini");
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "tidak ada alasan";
    await member.ban(reason)
      .catch(error => message.reply(`maaf ${message.author} saya tidak bisa ban karana : ${error}`));
    message.reply(`${member.user.tag} telah diban: ${message.author.tag} karena: ${reason}`);
  }
  
  if(command === "purge") {
    if(!message.member.roles.some(r=>["managemessages"].includes(r.name)) )
    return message.reply("maaf anda tidak bisa menggunakan command ini!");
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("saya hanya bisa membersikan chat dari 2-100");
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`tidak bisa menghapus karna: ${error}`));
  }
});

client.login(config.token);