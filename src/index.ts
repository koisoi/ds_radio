import { commands } from "commands";
import { config } from "config";
import { Client, GatewayIntentBits, Interaction } from "discord.js";
import { logger } from "utils";

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.once("clientReady", async () => {
    logger.log("Client is ready.");

    if (process.env.NODE_ENV === "DEVELOPMENT") {
        logger.warning("Radio bot runs in development mode now.");
    }

    const devGuild = client.guilds.cache.get(config.DISCORD_DEV_GUILD_ID);
    const catsShipGuild = client.guilds.cache.get(
        config.DISCORD_CATS_SHIP_GUILD_ID
    );

    logger.log("Fetching dev guild info...");
    // нужна ли проверка на undefined?
    // тип error?
    // TODO: выбрать между ролью с доступом и юзерами с доступом и убрать ненужный фетч
    devGuild?.members
        .fetch()
        .then(() => logger.success("Dev guild userlist fetched successfully!"))
        .catch((error: Error) =>
            logger.error(`Failed to get dev guild userlist: ${error.message}`)
        );

    devGuild?.roles
        .fetch()
        .then(() => logger.success("Dev guild roles fetched successfully!"))
        .catch((error: Error) =>
            logger.error(`Failed to get dev guild roles: ${error.message}`)
        );

    if (process.env.NODE_ENV !== "DEVELOPMENT") {
        catsShipGuild?.members
            .fetch()
            .then(() =>
                logger.success(
                    "Cats' Ship guild userlist fetched successfully!"
                )
            )
            .catch((error: Error) =>
                logger.error(
                    `Failed to get Cats' Ship guild userlist: ${error.message}`
                )
            );
        catsShipGuild?.roles
            .fetch()
            .then(() =>
                logger.success("Cats' Ship guild roles fetched successfully!")
            )
            .catch((error: Error) =>
                logger.error(
                    `Failed to get Cats' Ship guild roles: ${error.message}`
                )
            );
    }
});

client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const { commandName } = interaction;
    if (commands[commandName]) {
        commands[commandName].execute(interaction);
    }
});

client.on("error", async (error: Error) => {
    logger.error(error.message);
});

client.login(config.DISCORD_TOKEN);
