import { addTrack } from "api/playlists";
import {
    errorIcon,
    noSuchPlaylistMessage,
    successIcon,
    wrongLinkFormatMessage,
} from "const";
import { globalStore } from "store";
import { Execute, isYoutubeLink, Track } from "types";
import { logger } from "utils";

export const add_track: Execute = async (interaction) => {
    const playlistName = interaction.options.getString("playlist_name", true);
    if (!globalStore.takenNames.includes(playlistName)) {
        return interaction.editReply(noSuchPlaylistMessage);
    }

    const trackLink = interaction.options.getString("link", true);
    if (!isYoutubeLink(trackLink)) {
        return interaction.editReply(wrongLinkFormatMessage);
    }

    // thanks distube for writing and using Awaitable type. its called Promise if you didn't know
    try {
        const trackInfo = await globalStore.distubeClient.plugins[0].resolve(
            trackLink,
            {}
        );
        const track: Track = { name: trackInfo.name, ytLink: trackLink };

        addTrack(track, playlistName)
            .then(() => {
                logger.log(
                    `Track ${track.name} (${track.ytLink}) was added to ${playlistName} playlist by ${interaction.user.globalName}`
                );
                return interaction.editReply(
                    successIcon +
                        `Трек **${
                            track.name || "без названия"
                        }** был успешно добавлен в плейлист **${playlistName}**!`
                );
            })
            .catch((error) => {
                logger.error(
                    `Error adding track to playlist: ${error}\nTrack link: ${trackLink}, playlist name: ${playlistName}`
                );
                return interaction.editReply(
                    errorIcon + "Ошибка при добавлении трека в плейлист..."
                );
            });
    } catch (error) {
        logger.error(
            `Error resolving track: ${error}\nTrack link: ${trackLink}`
        );
        return interaction.editReply(
            errorIcon + "Ошибка при получении трека с YouTube..."
        );
    }
};
