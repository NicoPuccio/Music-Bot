const Discord = require('discord.js');
const {
    prefix, 
    token
} = require('./config.json');
const ytdl = require ('ytdl-core');

const client = new Discord.Client();
client.login(token);

client.once('ready', () => {
    console.log('Ready!');
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});
client.on('message', async message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
});

const serverQueue = queue.get(message.guild.id);

if(message.content.startsWith(`${prefix}play`)){
    execute(message, serverQueue);
    return;
}
else if(message.content.startsWith(`${prefix}stop`)){
    stop(message, serverQueue);
    return;
}
else if(message.content.startsWith(`{prefix}skip`)){
    skip(message, serverQueue);
    return;
}
else{
    message.channel.send('¿Te cuesta escribir bien los comandos no? Me imagino como seras jugando, manco');
}

const queue = new Map();
async function execute(message, serverQueue);
const args = message.content.split(' ');
const isInVoiceChannel = message.member.voiceChannel;
if(!isInVoiceChannel) return channel.message.send('Necesitas estar en un canal de voz para poner play bro');
const permissions = voiceChannel.permissionsFor(message.client.user);
if(!permissions.has('CONNECT') || !permissions.has('SPEAK')) return channel.message.send("Necesito que me des permisos para unirme y hablar en el server, maestro");

const songInfo = await ytdl.getInfo(args[1]); //the splitted message has in the second argument the link
const song = {
    tittle: songInfo.title,
    url: songInfo.url
};

if(!serverQueue){

}else{
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    return message.channel.send(`${song.title} se agrego a la playlist`);
}

const queueContract = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true
};
queue.set(message.guild.id, queueContract);
queueContract.songs.push(song);

try{
    var connection = await voiceChannel.join();
    queueContract.connection = connection;
    play(message.guild, queueContract.songs[0]);
} catch (err){
    console.log(err);
    queue.delete(message.guild.id);
    return message.channel.send(err);
}

//play a song
function play(guild, song){
    const serverQueue = queue.get(guild.id);
    if(!song){
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', () => {
        console.log('Music ended!');
        serverQueue.songs.shift(); //this is what deletes the finished songs from the queue
        play(guild, serverQueue.songs[0]);
    })
    .on('error', err => {
        console.error(error);
    });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}