import { Collection, User, Message } from 'discord.js';

export const convertIdsToUsernames = (content: string, users: Collection<string, User>) => {
    const regex = /<@(\d+)>/g;
    return content.replace(regex, (match, userId) => {
        const username = users.get(userId)?.username ?? userId;
        return `${username}`;
    });
}

export const startsWith = (message: Message, str: string) => {
    let content = convertIdsToUsernames(message.content.toLowerCase(), message.mentions.users).trim();
    if(message.guildId && content.toLowerCase().startsWith('ai ale ' + str) || !message.guildId && content.toLowerCase().startsWith(str)) {
        return true;
    }

    return false;
};