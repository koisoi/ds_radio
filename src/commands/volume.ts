import { errorIcon, noAccessMessage, successIcon } from "const";
import { SlashCommandBuilder } from "discord.js";
import { globalStore } from "store";
import { Execute } from "types";
import { isPermittedMember, logger } from "utils";

export const data = new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Установить громкость радио")
    .addNumberOption((option) =>
        option
            .setName("volume")
            .setDescription("Громкость от 0 до 100 (50 - по умолчанию)")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(100)
    );

export const execute: Execute = async (interaction) => {
    await interaction.deferReply({ flags: "Ephemeral" });

    if (!isPermittedMember(interaction.member)) {
        return interaction.editReply(noAccessMessage);
    }

    const volume = interaction.options.getNumber("volume", true);

    try {
        globalStore.distubeClient.setVolume(globalStore.guildID, volume);

        return interaction.editReply(
            successIcon + `Громкость ${volume} установлена!`
        );
    } catch (error) {
        logger.error(`Error changing volume: ${error}`);
        return interaction.editReply(
            errorIcon + "Ошибка при изменении громкости..."
        );
    }
};
