//Discord
import { Client, Events, Message, TextChannel } from 'discord.js';
import openai from '../lib/openai';
import { convertIdsToUsernames } from '../lib/utils/messages';

const botId = process.env.BOT_ID || '';
const chatModel = process.env.OPENAI_CHAT_MODEL || 'gpt-3.5-turbo';
const initialPrompt = process.env.INITIAL_PROMPT

/**
 * This event lets user's use the chat functionality provided by OpenAI
 */
module.exports = {
	name: Events.MessageCreate,
	async execute(client: Client, message: Message) {
		if (message.author.bot) return;

        // Get the message channel
		const channel = await client.channels.cache.get(message.channelId) as TextChannel;

        // Create the chat message array for openai
        let messages = [];

        // Create a message history array of our referenced messages
        let messageHistory = [];

        // If the message has a history on replies
        if(message.reference) {

            // Push our first referenced message
            let nextMessage = await channel.messages.fetch(message.reference.messageId);
            messageHistory.push(nextMessage);

            while(nextMessage.reference) {
                nextMessage = await channel.messages.fetch(nextMessage.reference.messageId);
                messageHistory.push(nextMessage);
            }
        }

        // If the message history has a message which the bot created or which it is mentioned in, then create our history.
        if(
            messageHistory.some(msg => msg.author.id === botId) || 
            message.mentions.users.some(user => user.id === botId) || 
            !message.guildId //Direct message to the bot
        ) {

            // Create the chat history for open ai chat completion
            for(let i = 0; i < messageHistory.length; i++) {
                const msg = messageHistory[i] as Message;

                messages.push({
                    role: msg.author.id === botId ? 'system' : 'user',
                    content: convertIdsToUsernames(msg.content, msg.mentions.users).trim()
                });
            }

            messages.unshift({
                role: message.author.id === botId ? 'system' : 'user',
                content: convertIdsToUsernames(message.content, message.mentions.users).trim()
            });
        }

        // If there are any messages
        if(messages.length) {

            // Give the initial prompt to the chat if there is one
            if(initialPrompt) {
                messages.push({
                    role: 'user',
                    content: initialPrompt
                });
            }

            // Reverse the entire chat history to make start from the beginning to the end, instead of the other way around
		    messages.reverse();

            // Send it to AI.
            try {
                const { data } = await openai.createChatCompletion({
                    model: chatModel,
                    messages: messages,
                    max_tokens: 512
                });
        
                message.reply(data.choices[0].message.content);
            } catch {
                message.reply("I'm so sorry, I could not fulfill your request.");
            }
        }
	},
};