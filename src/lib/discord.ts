import { 
    Client, 
    Partials, 
    GatewayIntentBits, 
    CommandInteraction, 
    Collection,
    SlashCommandBuilder
} from 'discord.js';

interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

class CustomClient extends Client {
    commands: Collection<SlashCommandBuilder, CommandInteraction>;
}

const client = new CustomClient({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.Reaction,
        Partials.GuildMember
    ]
});

client.commands = new Collection();

export default client;