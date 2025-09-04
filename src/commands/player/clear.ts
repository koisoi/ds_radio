import { YouTubePlugin } from "@distube/youtube";
import {
    broadcastModeOnlyMessage,
    errorIcon,
    noAccessMessage,
    nothingIsPlayingMessage,
    successIcon,
} from "const";
import { SlashCommandBuilder } from "discord.js";
import { Song } from "distube";
import { globalStore } from "store";
import { Execute } from "types";
import { isPermittedMember, logger } from "utils";

export const data = new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Очистить очередь, кроме играющего трека");

export const execute: Execute = async (interaction) => {
    await interaction.deferReply({ flags: "Ephemeral" });

    if (!isPermittedMember(interaction.member)) {
        return interaction.editReply(noAccessMessage);
    }

    if (!globalStore.broadcastMode) {
        return interaction.editReply(broadcastModeOnlyMessage);
    }

    const queue = globalStore.distubeClient.getQueue(globalStore.guildID);

    if (!queue?.songs.length) {
        return interaction.editReply(nothingIsPlayingMessage);
    }

    try {
        queue.songs.splice(1);

        logger.log(`Queue was cleared by ${interaction.user.globalName}`);
        return interaction.editReply(successIcon + "Очередь очищена!");
    } catch (error) {
        logger.error(`Error clearing: ${error}`);
        return interaction.editReply(
            errorIcon + "Ошибка при очистке очереди..."
        );
    }
};
