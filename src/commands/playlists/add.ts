import { addPlaylist } from "api";
import { errorIcon, noAccessIcon, successIcon } from "const";
import { Playlist } from "distube";
import { Execute, stringToTimeRange } from "types";
import { logger } from "utils";

export const add: Execute = async (interaction) => {
    // TODO: проверка уникальности имени!
    const playlistName = interaction.options.getString("name", true);
    // const scheduledTimeString = interaction.options.getString("time");
    // const scheduledTimeRange = scheduledTimeString
    //     ? stringToTimeRange(scheduledTimeString)
    //     : null;

    // if (scheduledTimeString !== undefined && scheduledTimeRange === null) {
    //     return interaction.editReply(noAccessIcon + "Неверный формат времени!");
    // }

    // const newPlaylist: Playlist = {
    //     name: playlistName,
    //     tracks: []
    // }

    // TODO: дописать правильное добавление таймстемпов
    return addPlaylist({ name: playlistName, tracks: [], scheduled: false })
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
                `Error creating playlist: ${error}\nPlaylist name: ${playlistName}, scheduled time: ${undefined}`
            );
            return interaction.editReply(
                errorIcon + `Ошибка при создании плейлиста...`
            );
        });
};
