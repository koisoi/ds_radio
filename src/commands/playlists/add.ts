import { addPlaylist } from "api";
import {
    errorIcon,
    noAccessIcon,
    successIcon,
    uniqueNamesOnlyMessage,
} from "const";
import { globalStore } from "store";
import { Execute, Playlist, stringToTimeRange } from "types";
import { logger } from "utils";

export const add: Execute = async (interaction) => {
    const playlistName = interaction.options.getString("playlist_name", true);
    if (globalStore.takenNames.includes(playlistName)) {
        return interaction.editReply(uniqueNamesOnlyMessage);
    }

    const scheduledTimeString = interaction.options.getString("time_range");
    const scheduledTimeRange = scheduledTimeString
        ? stringToTimeRange(scheduledTimeString)
        : null;

    if (scheduledTimeString !== null && scheduledTimeRange === null) {
        return interaction.editReply(noAccessIcon + "Неверный формат времени!");
    }

    const newPlaylist: Playlist =
        scheduledTimeRange === null
            ? {
                  name: playlistName,
                  tracks: [],
                  scheduled: false,
              }
            : {
                  name: playlistName,
                  tracks: [],
                  scheduled: true,
                  timeRange: scheduledTimeRange,
              };

    addPlaylist(newPlaylist)
        .then(() => {
            logger.log(
                `Playlist ${playlistName} was created by ${interaction.user.globalName}`
            );
            return interaction.editReply(
                successIcon + `Плейлист ${playlistName} был успешно создан!`
            );
        })
        .catch((error) => {
            logger.error(
                `Error creating playlist: ${error}\nPlaylist name: ${playlistName}, scheduled time: ${scheduledTimeString}`
            );
            return interaction.editReply(
                errorIcon + `Ошибка при создании плейлиста...`
            );
        });
};
