import {
    broadcastModeOnlyMessage,
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
    .setName("remove")
    .setDescription("Удалить трек из очереди")
    .addNumberOption((option) =>
        option
            .setName("number")
            .setDescription("Номер трека в очереди")
            .setRequired(true)
            .setMinValue(1)
    );
// .addStringOption((option) =>
//     option
//         .setName("trackname")
//         .setDescription("Название трека")
//         .setRequired(true)
//         .setAutocomplete(true)
// );

// TODO: remove
// export const autocomplete: AutocompleteFunction = async (interaction) => {
// 	const focusedValue = interaction.options.getFocused();

//     const queue = globalStore.distubeClient.getQueue(globalStore.guildID);
//     if (!queue) return;

// 	const choices = queue.songs.map((song) => song.name);
// 	const filtered = choices.filter(choice => choice.startsWith(focusedValue));
// 	await interaction.respond(
// 		filtered.map(choice => ({ name: choice, value: choice })),
// 	);
// };

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

    const trackNumber = interaction.options.getNumber("number", true);
    if (trackNumber < 1 || trackNumber > queue.songs.length) {
        return interaction.editReply(
            noAccessIcon + "Введен несуществующий номер!"
        );
    }

    const removedTrackName = queue.songs[trackNumber - 1].name;

    try {
        queue.songs.splice(trackNumber - 1, 1);

        logger.log(
            `Track ${removedTrackName} was removed from queue by ${interaction.user.globalName}`
        );
        return interaction.editReply(
            successIcon + `Трек **${removedTrackName}** удален из очереди!`
        );
    } catch (error) {
        logger.error(`Error removing track: ${error}`);
        return interaction.editReply(
            errorIcon + "Ошибка при удалении трека из очереди..."
        );
    }
};
