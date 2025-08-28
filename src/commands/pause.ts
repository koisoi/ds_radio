import {
    errorIcon,
    noAccessMessage,
    nothingIsPlayingMessage,
    successIcon,
} from "const";
import { SlashCommandBuilder } from "discord.js";
import { globalStore } from "store";
import { Execute } from "types";
import { isPermittedMember, logger } from "utils";

export const data = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Пауза");

export const execute: Execute = async (interaction) => {
    await interaction.deferReply({ flags: "Ephemeral" });

    if (!isPermittedMember(interaction.member)) {
        return interaction.editReply(noAccessMessage);
    }

    const queue = globalStore.distubeClient.getQueue(globalStore.guildID);

    if (!queue?.songs.length) {
        return interaction.editReply(nothingIsPlayingMessage);
    }

    queue
        .pause()
        .then(() => {
            return interaction.editReply(
                successIcon + "Воспроизведение остановлено!"
            );
        })
        .catch((error) => {
            logger.error(`Error pausing: ${error}`);
            return interaction.editReply(errorIcon + "Ошибка при паузе...");
        });
};
