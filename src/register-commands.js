require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'hey',
        description: 'Replies with hey!',
    },
    {
        name: 'ping',
        description: 'Pong!',
    },
    {
      name: 'bonapp',
      description: 'Bon allez, bon app!',
    },
    {
        name: 'meteo',
        description: 'Quel temps fait-il à ... ?',
        options: [
            {
            name: 'ville',
            description: 'Ville',
            type: ApplicationCommandOptionType.String,
            required: true,
            },
        ],
    },
    {
        name: 'table',
        description: 'générateur de table html',
        options: [
            {
                name: 'colonnes',
                description: 'Nombre de colonnes',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: 'lignes',
                description: 'Nombre de lignes',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ],
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
