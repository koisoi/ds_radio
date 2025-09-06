import { deletePlaylist } from "api";
import { errorIcon, noSuchPlaylistMessage, successIcon } from "const";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    CollectorFilter,
} from "discord.js";
import { globalStore } from "store";
import { Execute } from "types";
import { logger } from "utils";

// TODO: for review, was written when i was tired
export const del: Execute = async (interaction) => {
    if (interaction.channel === null) {
        return interaction.editReply(
            errorIcon + "Ошибка при отправке команды..."
        );
    }

    const playlistName = interaction.options.getString("playlist_name", true);
    if (!globalStore.takenNames.includes(playlistName)) {
        return interaction.editReply(noSuchPlaylistMessage);
    }

    const confirm = new ButtonBuilder()
        .setCustomId(`confirm-${interaction.id}`)
        .setLabel("Подтеврдить удаление")
        .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
        .setCustomId(`cancel-${interaction.id}`)
        .setLabel("Отмена")
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        cancel,
        confirm
    );

    await interaction.editReply({
        content: `Вы уверены, что хотите удалить плейлист **${playlistName}**?`,
        components: [row],
    });

    const filter: CollectorFilter<ButtonInteraction<"cached">[]> = (action) =>
        action.customId === `confirm-${interaction.id}` ||
        action.customId === `cancel-${interaction.id}`;

    // FIXME: i know that any is a death sin but im gonna go fucking insane with all those discordjs types
    const collector = interaction.channel.createMessageComponentCollector<any>({
        filter,
        time: 120000,
    });

    collector.on("collect", async (action: ButtonInteraction) => {
        if (action.user.id !== interaction.user.id) {
            action.reply({
                content: `Данная команда была вызвана другим пользователем.`,
                ephemeral: true,
            });
            return;
        } else {
            if (action.customId === `cancel-${interaction.id}`) {
                return interaction.editReply({
                    content: successIcon + "Удаление плейлиста было отменено.",
                    components: [],
                });
            } else {
                deletePlaylist(playlistName)
                    .then(() => {
                        logger.log(
                            `Playlist ${playlistName} was deleted by ${interaction.user.globalName}`
                        );
                        return interaction.editReply({
                            content:
                                successIcon +
                                `Плейлист ${playlistName} был успешно удален!`,
                            components: [],
                        });
                    })
                    .catch((error) => {
                        logger.error(
                            `Error deleting playlist: ${error}\nPlaylist name: ${playlistName}`
                        );
                        return interaction.editReply({
                            content:
                                errorIcon + `Ошибка при удалении плейлиста...`,
                            components: [],
                        });
                    });
            }
        }
    });

    collector.on("end", () => {
        collector.stop();
        return;
    });
};
