import {
    broadcastModeOnlyMessage,
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
    .setName("stop")
    .setDescription("Остановить воспроизведение и очистить очередь");

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

    queue
        .stop()
        .then(() => {
            logger.log(`Player was stopped by ${interaction.user.globalName}`);
            return interaction.editReply(successIcon + "Очередь очищена!");
        })
        .catch((error) => {
            logger.error(`Error stopping: ${error}`);
            return interaction.editReply(
                errorIcon + "Ошибка при очистке очереди..."
            );
        });
};
