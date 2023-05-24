import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// Logger
import logger from './lib/logger';

// Discord
import Client from './lib/discord';
import { 
    Events, 
    REST, 
    Routes, 
    PresenceStatusData,
    ActivityType
} from 'discord.js';

const CLIENT_TOKEN = process.env.DISCORD_CLIENT_TOKEN;
const APPLICATION_ID = process.env.APPLICATION_ID;
const BOT_PRESENCE = process.env.BOT_PRESENCE || 'online';

Client.once(Events.ClientReady, async (c) => {
    logger.info(`Watching a total of ${Client.guilds.cache.size} servers.`);
    logger.info(`Bot ready! Logged in as ${c.user.tag}`);

    // Set bot status here
    const status: PresenceStatusData = BOT_PRESENCE as PresenceStatusData;
    Client.user.setPresence({
        status,
        activities: [{
            name: `${Client.guilds.cache.size} servers`,
            type: ActivityType.Listening
        }],
    });
});

const initEvents = () =>  {
    // Get all the event files
    const eventsPath = path.join(__dirname, './events');
    const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.ts'));

    // Initialize the event files with the Discord Client
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath) as { name: string, execute: Function };
        Client.on(event.name, (...args: any[]) => event.execute(Client, ...args));
    }

    logger.info(`Events initialized`);
};

const initCommands = async () =>  {
    const commands = [];

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            Client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
          logger.error(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(CLIENT_TOKEN);
    try {
        logger.info(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(APPLICATION_ID),
            { body: commands },
        ) as any[];

        logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        logger.error(error);
    }

    logger.info(`Commands registered`);
};

export default async () => {

    // Register commands
    await initCommands();

    // Load events
    initEvents();

    Client.login(CLIENT_TOKEN);
};