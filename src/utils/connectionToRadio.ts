import { Client } from "discord.js";
import { logger } from "./logger";
import { config } from "config";
import { globalStore } from "store";

type ConnectToRadioChannelProps = {
    client: Client<boolean>;
    mode: "dev" | "prod";
};

export const connectToRadioChannel = ({
    client,
    mode,
}: ConnectToRadioChannelProps) => {
    const guildTitle = mode === "dev" ? "Dev guild" : "Cats' Ship";
    logger.log(`Connecting to ${guildTitle} radio channel...`);

    let guild = client.guilds.cache.get(
        mode === "dev"
            ? config.DISCORD_DEV_GUILD_ID
            : config.DISCORD_CATS_SHIP_GUILD_ID
    );
    if (guild === undefined) {
        logger.error(
            "Could not get a guild from cache in connectToRadioChannel."
        );
        return;
    }

    const channel = guild.channels.cache.get(
        mode === "dev" ? config.DEV_RADIO_CHANNEL_ID : config.RADIO_CHANNEL_ID
    );
    if (!channel || !channel?.isVoiceBased()) {
        logger.error(
            "Could not get a radio channel from cache in connectToRadioChannel."
        );
        return;
    }

    globalStore.distubeClient.voices.join(channel).then(() => {
        guild.members.cache
            .get(config.DISCORD_CLIENT_ID)
            ?.voice.setSuppressed(false)
            .catch((error: Error) => {
                logger.error(
                    `Can't speak in the ${guildTitle} radio channel: ${error.message}`
                );
            });
        logger.success(`Connected to ${guildTitle} radio channel!`);
    });

    // const connection = joinVoiceChannel({
    //     channelId: config.DEV_RADIO_CHANNEL_ID,
    //     guildId: config.DISCORD_DEV_GUILD_ID,
    //     adapterCreator: guild.voiceAdapterCreator,
    //     selfDeaf: true,
    // });

    // connection.on(VoiceConnectionStatus.Ready, () => {
    //     guild.members.cache
    //         .get(config.DISCORD_CLIENT_ID)
    //         ?.voice.setSuppressed(false)
    //         .catch((error: Error) => {
    //             logger.error(
    //                 `Can't speak in the ${guildTitle} radio channel: ${error.message}`
    //             );
    //         });
    //     logger.success(`Connected to ${guildTitle} radio channel!`);
    // });

    // connection.on(VoiceConnectionStatus.Disconnected, async () => {
    //     logger.log(
    //         "Bot was disconnected from voice channel. Trying to reconnect..."
    //     );
    // });

    // connection.on("error", (error: Error) => {
    //     logger.error(
    //         `Could not connect to ${guildTitle} radio channel: ${error.message}`
    //     );
    // });
};
