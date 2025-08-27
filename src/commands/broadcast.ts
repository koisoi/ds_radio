import { SlashCommandBuilder } from "discord.js";
import { globalStore } from "store";
import { Execute } from "types";
import { isPermittedMember, logger } from "utils";

export const data = new SlashCommandBuilder()
    .setName("broadcast")
    .setDescription("Режим эфира")
    .addBooleanOption((option) =>
        option
            .setName("mode")
            .setDescription("true - включить, false - выключить")
    );

export const execute: Execute = async (interaction) => {
    await interaction.deferReply();

    if (!isPermittedMember(interaction.member)) {
        return interaction.editReply(
            "❌ Эта команда доступна только пользователям с ролью DJ!"
        );
    }

    const mode = interaction.options.getBoolean("mode");
    if (mode === null) {
        if (globalStore.broadcastMode) {
            return interaction.editReply("🔴  **Режим эфира сейчас включен!**");
        }
        return interaction.editReply("📻  **Режим эфира сейчас выключен!**");
    }

    globalStore.broadcastMode = mode;

    if (mode === true) {
        logger.log(
            `Broadcast mode was turned ON by ${interaction.user.globalName}`
        );
        return interaction.editReply("🔴  **Режим эфира включен!**");
    } else {
        logger.log(
            `Broadcast mode was turned OFF by ${interaction.user.globalName}`
        );
        return interaction.editReply("📻  **Режим эфира выключен!**");
    }
};
