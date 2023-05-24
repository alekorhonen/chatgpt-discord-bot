//Discord
import { 
    Events,
    Guild,
    Client
} from 'discord.js';

import logger from '../lib/logger';

module.exports = {
	name: Events.GuildDelete,
	async execute(client: Client, guild: Guild) {
        logger.info(`Bot was removed from the server ${guild.name.trim()}`);
    }
}