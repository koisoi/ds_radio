import {
    broadcastModeOnlyMessage,
    errorIcon,
    noAccessMessage,
    successIcon,
} from "const";
import { SlashCommandBuilder } from "discord.js";
import { globalStore } from "store";
import { Execute } from "types";
import { isPermittedMember, logger } from "utils";

// TODO: добавление плейлиста в очередь
export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Добавить трек в очередь")
    .addStringOption((option) =>
        option
            .setName("query")
            .setDescription("Ссылка на YouTube или поисковой запрос")
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName("mode")
            .setDescription("Режим добавления в очередь")
            .addChoices(
                { name: "добавить в конец", value: "default" },
                { name: "добавить следующим", value: "next" }
            )
    );

export const execute: Execute = async (interaction) => {
    await interaction.deferReply({ flags: "Ephemeral" });

    if (!isPermittedMember(interaction.member)) {
        return interaction.editReply(noAccessMessage);
    }

    if (!globalStore.broadcastMode) {
        return interaction.editReply(broadcastModeOnlyMessage);
    }

    const channel = interaction.guild.channels.cache.get(
        globalStore.radioChannelID
    );
    if (!channel || !channel?.isVoiceBased()) {
        logger.error("Could not get a voice channel from radioChannelID.");
        return;
    }

    const query = interaction.options.getString("query", true);
    const mode = interaction.options.getString("mode");
    let position: number | undefined = undefined;
    switch (mode) {
        case "next":
            position = 1;
            break;

        default:
            position = 0;
            break;
    }

    globalStore.distubeClient
        .play(channel, query, {
            position: position,
        })
        .then(() => {
            const queue =
                globalStore.distubeClient.getQueue(globalStore.guildID)
                    ?.songs || [];

            let trackName = "";
            let willBePlayed = "";

            switch (mode) {
                case "next":
                    trackName = queue[1].name || "без названия";
                    willBePlayed = " и будет проигран после текущего трека";
                    break;

                default:
                    trackName = queue?.slice(-1)[0].name || "без названия";
                    break;
            }

            logger.log(
                `Track ${trackName} was added to the queue by ${interaction.user.globalName}`
            );

            return interaction.editReply(
                successIcon +
                    `Трек ${trackName} был успешно добавлен в очередь${willBePlayed}!`
            );
        })
        .catch((error) => {
            logger.error(
                `Error when trying to add track to queue: ${error}\nQuery or link: ${query}, was added by: ${interaction.user.globalName}`
            );
            return interaction.editReply(
                errorIcon +
                    "Ошибка... Измените ссылку или запрос и попробуйте еще раз."
            );
        });
};
