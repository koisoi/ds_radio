import { joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
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

    // TODO: убрать коммент если добавлю на корабль
    if (devGuild === undefined /*|| catsShipGuild === undefined*/) {
        throw new Error("Could not get a guild from cache...");
    }

    logger.log("Fetching dev guild info...");
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
        logger.log("Fetching Cats' Ship guild info...");
        catsShipGuild?.members
            .fetch()
            .then(() =>
                logger.success("Cats' Ship userlist fetched successfully!")
            )
            .catch((error: Error) =>
                logger.error(
                    `Failed to get Cats' Ship userlist: ${error.message}`
                )
            );
        catsShipGuild?.roles
            .fetch()
            .then(() =>
                logger.success("Cats' Ship roles fetched successfully!")
            )
            .catch((error: Error) =>
                logger.error(`Failed to get Cats' Ship roles: ${error.message}`)
            );
    }

    if (process.env.NODE_ENV === "DEVELOPMENT") {
        logger.log("Connecting to Dev radio channel...");

        const connection = joinVoiceChannel({
            channelId: config.DEV_RADIO_CHANNEL_ID,
            guildId: config.DISCORD_DEV_GUILD_ID,
            adapterCreator: devGuild.voiceAdapterCreator,
            selfDeaf: true,
        });

        connection.on(VoiceConnectionStatus.Ready, () => {
            devGuild.members.cache
                .get(config.DISCORD_CLIENT_ID)
                ?.voice.setSuppressed(false);
            logger.success("Connected to Dev guild radio channel!");
        });

        connection.on("error", (error: Error) => {
            logger.error(
                `Could not connect to Dev guild radio channel: ${error.message}`
            );
        });
    } // TODO: убрать коммент если добавлю на корабль
    /* else {
        logger.log("Connecting to Cats' Ship radio channel...");

        const connection = joinVoiceChannel({
            channelId: config.RADIO_CHANNEL_ID,
            guildId: config.DISCORD_CATS_SHIP_GUILD_ID,
            adapterCreator: catsShipGuild.voiceAdapterCreator,
            selfDeaf: true
        })

        connection.on(VoiceConnectionStatus.Ready, () => {
            catsShipGuild.members.cache.get(config.DISCORD_CLIENT_ID)?.voice.setSuppressed(false);
            logger.success("Connected to Cats' Ship radio channel!");
        })

        connection.on('error', (error: Error) => {
            logger.error(`Could not connect to Cats' Ship radio channel: ${error.message}`);
        })
    }*/
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
