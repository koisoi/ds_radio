import { noAccessMessage } from "const";
import { SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { AutocompleteFunction, Execute } from "types";
import { isPermittedMember } from "utils";
import { add } from "./add";
import { globalStore } from "store";
import { del } from "./delete";
import { show } from "./show";
import { showall } from "./showall";
import { addtrack } from "./addtrack";

const existingPlaylistNameOption = (option: SlashCommandStringOption) =>
    option
        .setName("name")
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
                    .setName("name")
                    .setDescription("Название плейлиста")
                    .setRequired(true)
            )
            .addStringOption((option) =>
                option
                    .setName("time")
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
            .setName("showall")
            .setDescription("Список всех существующих плейлистов")
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("addtrack")
            .setDescription("Добавить трек в плейлист")
            .addStringOption((option) =>
                option
                    .setName("link")
                    .setDescription("Ссылка на видео с треком (YouTube)")
                    .setRequired(true)
            )
            .addStringOption(existingPlaylistNameOption)
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

        case "showall":
            return showall(interaction);

        case "addtrack":
            return addtrack(interaction);

        case "deletetrack":
            break;

        case "schedule":
            break;

        case "unschedule":
            break;

        default:
            break;
    }
};
