import { noAccessMessage } from "const";
import { SlashCommandBuilder } from "discord.js";
import { globalStore } from "store";
import { Execute } from "types";
import { isPermittedMember, logger } from "utils";

export const data = new SlashCommandBuilder()
    .setName("broadcast")
    .setDescription("Режим эфира")
    .addStringOption((option) =>
        option
            .setName("mode")
            .setDescription("Включить или выключить")
            .addChoices(
                { name: "ВКЛ", value: "on" },
                { name: "ВЫКЛ", value: "off" }
            )
    );

export const execute: Execute = async (interaction) => {
    await interaction.deferReply();

    if (!isPermittedMember(interaction.member)) {
        return interaction.editReply(noAccessMessage);
    }

    const mode = interaction.options.getString("mode");

    if (mode === "on") {
        globalStore.broadcastMode = true;
        logger.log(
            `Broadcast mode was turned ON by ${interaction.user.globalName}`
        );
        return interaction.editReply("🔴  **Режим эфира включен!**");
    } else if (mode === "off") {
        globalStore.broadcastMode = false;
        logger.log(
            `Broadcast mode was turned OFF by ${interaction.user.globalName}`
        );
        return interaction.editReply("📻  **Режим эфира выключен!**");
    } else {
        if (globalStore.broadcastMode) {
            return interaction.editReply("🔴  **Режим эфира сейчас включен!**");
        }
        return interaction.editReply("📻  **Режим эфира сейчас выключен!**");
    }
};
