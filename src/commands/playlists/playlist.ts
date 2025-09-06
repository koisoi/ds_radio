import { noAccessMessage } from "const";
import { SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { AutocompleteFunction, Execute } from "types";
import { isPermittedMember } from "utils";
import { add } from "./add";
import { globalStore } from "store";
import { del } from "./delete";
import { show } from "./show";
import { show_all } from "./show_all";
import { add_track } from "./add_track";
import { delete_track } from "./delete_track";

const existingPlaylistNameOption = (option: SlashCommandStringOption) =>
    option
        .setName("playlist_name")
        .setDescription("Название плейлиста")
        .setRequired(true)
        .setAutocomplete(true);

export const data = new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Действия с плейлистами")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("add")
            .setDescription("Добавить новый плейлист")
            .addStringOption((option) =>
                option
                    .setName("playlist_name")
                    .setDescription("Название плейлиста")
                    .setRequired(true)
            )
            .addStringOption((option) =>
                option
                    .setName("time_range")
                    .setDescription(
                        "Период времени, в который играет плейлист (формат чч:мм-чч:мм)"
                    )
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("delete")
            .setDescription("Удалить плейлист")
            .addStringOption(existingPlaylistNameOption)
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("show")
            .setDescription("Показать плейлист")
            .addStringOption(existingPlaylistNameOption)
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("show_all")
            .setDescription("Список всех существующих плейлистов")
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("add_track")
            .setDescription("Добавить трек в плейлист")
            .addStringOption(existingPlaylistNameOption)
            .addStringOption((option) =>
                option
                    .setName("link")
                    .setDescription("Ссылка на видео с треком (YouTube)")
                    .setRequired(true)
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("delete_track")
            .setDescription("Удалить трек из плейлиста")
            .addStringOption(existingPlaylistNameOption)
            .addNumberOption((option) =>
                option
                    .setName("track_number")
                    .setDescription("Номер трека")
                    .setRequired(true)
                    .setMinValue(1)
            )
    );

// only playlist names autocomplete needed for all subcommands
export const autocomplete: AutocompleteFunction = async (interaction) => {
    const focusedValue = interaction.options.getFocused();

    const choices = globalStore.takenNames;
    const filtered = choices.filter((choice) =>
        choice.startsWith(focusedValue)
    );
    await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
    );
};

export const execute: Execute = async (interaction) => {
    await interaction.deferReply({ flags: "Ephemeral" });

    if (!isPermittedMember(interaction.member)) {
        return interaction.editReply(noAccessMessage);
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
        case "add":
            return add(interaction);

        case "delete":
            return del(interaction);

        case "show":
            return show(interaction);

        case "show_all":
            return show_all(interaction);

        case "add_track":
            return add_track(interaction);

        case "delete_track":
            return delete_track(interaction);

        case "schedule":
            break;

        case "unschedule":
            break;

        case "change_name":
            break;

        case "copy":
            break;

        default:
            break;
    }
};
