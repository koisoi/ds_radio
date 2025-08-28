import {
    errorIcon,
    noAccessIcon,
    noAccessMessage,
    nothingIsPlayingMessage,
    successIcon,
} from "const";
import { SlashCommandBuilder } from "discord.js";
import { globalStore } from "store";
import { Execute } from "types";
import { isPermittedMember, logger } from "utils";

export const data = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Пропустить играющий трек");

export const execute: Execute = async (interaction) => {
    await interaction.deferReply({ flags: "Ephemeral" });

    if (!isPermittedMember(interaction.member)) {
        return interaction.editReply(noAccessMessage);
    }

    const queue = globalStore.distubeClient.getQueue(globalStore.guildID);

    if (!queue?.songs.length) {
        return interaction.editReply(nothingIsPlayingMessage);
    }

    const skippedTrackName = queue.songs[0].name;

    (queue.songs.length === 1 ? queue.stop() : queue.skip())
        .then(() => {
            logger.log(
                `Track ${skippedTrackName} was skipped by ${interaction.user.globalName}`
            );
            return interaction.editReply(successIcon + "Трек пропущен!");
        })
        .catch((error) => {
            logger.error(`Error skipping track: ${error}`);
            return interaction.editReply(
                errorIcon + "Ошибка при пропуске трека..."
            );
        });
};
