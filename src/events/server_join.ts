//Discord
import { 
    Client,
    Events,
    Guild
} from 'discord.js';

import logger from '../lib/logger';

module.exports = {
	name: Events.GuildCreate,
	async execute(client: Client, guild: Guild) {
        logger.info(`Bot was added to the server ${guild.name.trim()}`);
    }
}