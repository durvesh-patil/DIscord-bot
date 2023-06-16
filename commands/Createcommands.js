const { REST, Routes } = require('discord.js');
const dotenv = require("dotenv")

dotenv.config({ path: './config.env' })

const token = process.env.BOT_TOKEN

const commands = [{
    name: 'apply ',
    description: 'Provides with a application modal '
}]



const rest = new REST({ version: 10 }).setToken('MTExNTY5NzYxNjAwMTQ0MTgxMg.G6UPT5.ZZOR3ZnXN_k-coGK-9KtigCtqmic0WVKOiSwN8');

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        await rest.put(
            Routes.applicationCommands('1115697616001441812'),
            { body: commands },
        );

        console.log(`Successfully reloaded  application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();