//Discord
import { 
    Client, 
    Events, 
    Interaction,
    SlashCommandBuilder,
    CommandInteraction
} from 'discord.js';

import logger from '../lib/logger';

interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

class CustomClient extends Client {
    commands: Map<string, Command>;
}

module.exports = {
	name: Events.InteractionCreate,
	async execute(client: CustomClient, interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            logger.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            logger.error(error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}