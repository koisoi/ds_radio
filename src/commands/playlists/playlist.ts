import { noAccessMessage } from "const";
import { SlashCommandBuilder } from "discord.js";
import { Execute } from "types";
import { isPermittedMember } from "utils";

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
    );

export const execute: Execute = async (interaction) => {
    await interaction.deferReply({ flags: "Ephemeral" });

    if (!isPermittedMember(interaction.member)) {
        return interaction.editReply(noAccessMessage);
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
        case "add":
            break;

        case "delete":
            break;

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
