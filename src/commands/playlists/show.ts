import { getPlaylist } from "api";
import { errorIcon, noSuchPlaylistMessage } from "const";
import { globalStore } from "store";
import { Execute, isScheduledPlaylist, timeRangeToString } from "types";
import { logger } from "utils";

export const show: Execute = async (interaction) => {
    const playlistName = interaction.options.getString("playlist_name", true);
    if (!globalStore.takenNames.includes(playlistName)) {
        return interaction.editReply(noSuchPlaylistMessage);
    }

    getPlaylist(playlistName)
        .then((playlist) => {
            const printedTracks =
                playlist.tracks.length === 0
                    ? `Нет добавленных треков!`
                    : `${playlist.tracks
                          .map(
                              (track, i) =>
                                  `${i + 1}. **${
                                      track.name || "Без названия"
                                  }**: \`${track.ytLink}\``
                          )
                          .join("\n")}`;
            let scheduled = false;
            let timeRangeString = "";

            if (isScheduledPlaylist(playlist)) {
                scheduled = true;
                timeRangeString = timeRangeToString(playlist.timeRange);
            }

            interaction.editReply(
                `### ${playlist.name}\n${
                    scheduled ? `Время эфира: ${timeRangeString}\n` : ""
                }\n${printedTracks}`
            );
        })
        .catch((error) => {
            logger.error(
                `Error getting playlist: ${error}\nPlaylist name: ${playlistName}`
            );
            return interaction.editReply(
                errorIcon + `Ошибка при получении плейлиста...`
            );
        });
};
