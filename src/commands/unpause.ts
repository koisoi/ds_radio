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
    .setName("unpause")
    .setDescription("Продолжить воспроизведение");

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
        .resume()
        .then(() => {
            return interaction.editReply(
                successIcon + "Воспроизведение продолжено!"
            );
        })
        .catch((error) => {
            logger.error(`Error unpausing: ${error}`);
            return interaction.editReply(
                errorIcon + "Ошибка при воспроизведении..."
            );
        });
};
