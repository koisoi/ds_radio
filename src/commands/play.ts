import { config } from "config";
import { noAccessMessage } from "const";
import { SlashCommandBuilder } from "discord.js";
import { Events } from "distube";
import { globalStore } from "store";
import { Execute } from "types";
import { isPermittedMember, logger } from "utils";

export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Добавить трек в очередь")
    .addStringOption((option) =>
        option
            .setName("link")
            .setDescription("Ссылка на YouTube")
            .setRequired(true)
    )
    .addBooleanOption((option) =>
        option
            .setName("next")
            .setDescription("Проиграть следующим? True - да, False - нет")
    );

export const execute: Execute = async (interaction) => {
    await interaction.deferReply();

    if (!isPermittedMember(interaction.member)) {
        return interaction.editReply(noAccessMessage);
    }

    try {
        const channel = interaction.guild.channels.cache.get(
            config.DEV_RADIO_CHANNEL_ID
        );
        if (!channel || !channel?.isVoiceBased()) return;

        globalStore.distubeClient.play(
            channel,
            "https://www.youtube.com/watch?v=YTC75cKzuNk"
        );

        // globalStore.distubeClient.

        globalStore.distubeClient.on(Events.ERROR, (error) => {
            logger.error(`Error with resource: ${error}`);
            return interaction.editReply("Player error");
        });

        globalStore.distubeClient.on(Events.PLAY_SONG, () => {
            interaction.guild.members.cache
                .get(config.DISCORD_CLIENT_ID)
                ?.voice.setSuppressed(false)
                .catch((error: Error) => {
                    logger.error(
                        `Can't speak in the radio channel: ${error.message}`
                    );
                });
            interaction.editReply(`Track has started playing!`);
        });
    } catch (error) {
        logger.error(`Error downloading file: ${error}`);
        return interaction.editReply("Downloading error");
    }
};
