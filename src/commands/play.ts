import { config } from "config";
import { broadcastModeOnlyMessage, noAccessMessage } from "const";
import { SlashCommandBuilder } from "discord.js";
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
            .setName("immediately")
            .setDescription(
                "Прервать текущий трек и проиграть этот? True - да, False - нет"
            )
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

    if (!globalStore.broadcastMode) {
        return interaction.editReply(broadcastModeOnlyMessage);
    }

    try {
        const channel = interaction.guild.channels.cache.get(
            process.env.NODE_ENV === "development"
                ? config.DEV_RADIO_CHANNEL_ID
                : config.RADIO_CHANNEL_ID
        );
        if (!channel || !channel?.isVoiceBased()) return;

        globalStore.distubeClient.play(
            channel,
            "https://www.youtube.com/watch?v=YTC75cKzuNk"
        );
    } catch (error) {
        logger.error(`Error downloading file: ${error}`);
        return interaction.editReply("Downloading error");
    }
};
