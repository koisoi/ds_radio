import { YouTubePlugin } from "@distube/youtube";
import { commands } from "commands";
import { config } from "config";
import { Client, GatewayIntentBits, Interaction } from "discord.js";
import DisTube, { Events } from "distube";
import { globalStore } from "store";
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

    // DisTube initialization

    globalStore.distubeClient = new DisTube(client, {
        plugins: [new YouTubePlugin()],
        joinNewVoiceChannel: false,
    });

    if (process.env.NODE_ENV === "development") {
        logger.warning("Radio bot runs in development mode now.");
    }
    const guild = client.guilds.cache.get(globalStore.guildID);

    if (guild === undefined) {
        throw new Error("Could not get a guild from cache.");
    }

    logger.log("Fetching guild info...");
    // TODO: выбрать между ролью с доступом и юзерами с доступом и убрать ненужный фетч
    guild.members
        .fetch()
        .then(() => logger.success("Guild userlist fetched successfully!"))
        .catch((error) =>
            logger.error(`Failed to get guild userlist: ${error}`)
        );

    guild.roles
        .fetch()
        .then(() => logger.success("Guild roles fetched successfully!"))
        .catch((error) => logger.error(`Failed to get guild roles: ${error}`));

    logger.log(`Connecting to radio channel...`);

    const channel = guild.channels.cache.get(globalStore.radioChannelID);
    if (!channel || !channel?.isVoiceBased()) {
        logger.error(
            "Could not get a radio channel from cache in connectToRadioChannel."
        );
        return;
    }

    // joining the voice channel

    globalStore.distubeClient.voices
        .join(channel)
        .then(() => {
            guild.members.cache
                .get(config.DISCORD_CLIENT_ID)
                ?.voice.setSuppressed(false)
                .catch((error: Error) => {
                    logger.error(
                        `Can't speak in the radio channel: ${error.message}`
                    );
                });
            logger.success(`Connected to the radio channel!`);
        })
        .catch((error) =>
            logger.error(`Error connecting to radio channel: ${error}`)
        );

    // adding DisTube event handlers

    globalStore.distubeClient.on(Events.PLAY_SONG, (_, song) => {
        channel.send(`⏯️  Сейчас играет: **${song.name || "Без названия"}**`);
    });

    globalStore.distubeClient.on(Events.ERROR, (error) => {
        logger.error(`DisTube error: ${error}`);
    });

    globalStore.distubeClient.on(Events.DISCONNECT, () => {
        logger.error("Bot was disconnected.");
    });
});

client.on("interactionCreate", async (interaction: Interaction) => {
    if (
        !interaction.isCommand() ||
        !interaction.isChatInputCommand() ||
        !interaction.inCachedGuild()
    ) {
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
