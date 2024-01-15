require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');

const PREFIX = "!";

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`✅ ${c.user.tag} est connecté.`);

});
// répond aux message sans commands
client.on('messageCreate', (message) =>{
    if (message.content.startsWith(PREFIX)) {
        // On récupère un tableau des arguments sans le préfixe
        const input = message.content.slice(PREFIX.length).trim().split(" ");
        const command = input.shift();
        switch(command){
            case "cat":
                axios.get('https://api.thecatapi.com/v1/images/search')
                    .then(response => {
                        const apiResponse = response.data[0];
                        const url = apiResponse.url;
                        const embedChat = new EmbedBuilder()
                            .setColor('Random')
                            .setTitle('Chat 🐱')
                            .setImage(url)
                            .setTimestamp();
                        message.channel.send({embeds: [embedChat] });
                    })
                    .catch(error => {
                        const errorMessage = error.response;
                        message.reply(`${errorMessage}`);
                    });
                break;
            default:
                message.reply("Cette commande n'existe pas ! :(");
                break;
        }
    }
});


// Répond en utilisant la commandes
client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'hey') {
        return interaction.reply('Salut ');
    }

    if (interaction.commandName === 'ping') {
        return interaction.reply('Pong!');
    }
    if(interaction.commandName === 'table'){
        const col = interaction.options.getNumber('colonnes');
        const row = interaction.options.getNumber('lignes');
        const tout = '';
        tout =+'<table>';
        tout =+'<thead>';
        tout =+'\t\t<tr>';
        for(i=0;i<col.length;i++){
            tout=+ '<th>Titre de colonnes</th>';
        }
        tout =+'</tr>';
        tout =+'</thead>';
        tout =+'<tbody>';
        for(h=0;h<row.length;h++){
            tout =+'<tr>';
            for(j=0;i<col.length;j++){
                tout=+ '<td>Titre de colonnes</td>';
            }
            tout =+ '</tr>';
        }
        tout =+'</tbody>';
        interaction.reply(tout);
    }
    if(interaction.commandName === 'meteo'){
        const ville = interaction.options.getString('ville');
        const axios = require('axios');
        const accessapi = process.env.WHEATHERSTACK;
        axios.get('http://api.weatherstack.com/current?access_key='+accessapi+'&query='+ville)
        .then(response => {
            const apiResponse = response.data;
            const name = apiResponse.location.name;
            const region = apiResponse.location.region; 
            const country = apiResponse.location.country;
            const temp = apiResponse.current.temperature;
            const img = apiResponse.current.weather_icons[0];
            const vent = apiResponse.current.wind_speed;
            const temps = apiResponse.current.weather_descriptions[0];
            const ressenti = apiResponse.current.feelslike;
            //interaction.reply('La température actuelle à '+name+' ('+region+', '+country+') est de '+temp+'°C image :'+img)
            const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Quel temps fait-il à '+name+' ?')
            .setDescription(name+' se situe en '+region+', '+country)
            .setThumbnail(img)
            .addFields(
                { name: 'Température', value: `${temp} °C` },
                { name: 'Vent', value: `${vent} km/h` },
                { name: "Temps(en Anglais, parce que pas d'abonnement)", value: `${temps}` },
                { name: 'Ressenti', value: `${ressenti}` },
            )   
            .setTimestamp()
            interaction.reply({embeds: [embed] });
        }).catch(error => {
            const errorMessage = error.response ? error.response.data.error.info : 'Ville incorrecte ou inconnue';
            interaction.reply(`Vous avez saisi: ${ville}, ${errorMessage}`);
        });
    }
});

client.login(process.env.TOKEN);
