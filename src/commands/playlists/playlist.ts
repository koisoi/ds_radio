import { noAccessMessage } from "const";
import { SlashCommandBuilder } from "discord.js";
import { AutocompleteFunction, Execute } from "types";
import { isPermittedMember, logger } from "utils";
import { add } from "./add";
import { globalStore } from "store";
import { del } from "./delete";

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
            .addStringOption((option) =>
                option
                    .setName("name")
                    .setDescription("Название плейлиста")
                    .setRequired(true)
                    .setAutocomplete(true)
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
            break;

        case "showall":
            break;

        case "addtrack":
            break;

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
