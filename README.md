# Discord chatbot

## Description
A Discord bot that utilizes OpenAI's chat completion to answer whenever the bot is mentioned or is included in a message history.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (version 18 or higher)
- npm (version 9 or higher)
- MySQL database management system

## Setup

1. Clone the repository and navigate to the project directory
```
git clone https://github.com/alekorhonen/discord-chatbot bot
cd server
```

2. Install the project dependencies
```
npm install
```

3. Create the `.env` file in the project root based on `.env.sample`.
```
cp .env.sample .env
```

4. Fill in the values in the `.env` file with your own Discord and OpenAI keys.
```
# Discord
DISCORD_CLIENT_TOKEN=
APPLICATION_ID=
PRESENCE_STATUS=online
BOT_ID=

# OpenAI
INITIAL_PROMPT="You are an AI chatbot, a Discord chat bot designed to provide information upon request. Please incorporate a blend of sarcasm, irony, and humor throughout the rest of our conversation."
OPENAI_API_KEY=
OPENAI_CHAT_MODEL=
OPENAI_MAX_TOKENS=
```

5. Start the bot.
```
npm run dev
```