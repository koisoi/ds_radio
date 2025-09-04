import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    InteractionResponse,
    Message,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export type Execute = (
    // TODO: посмотреть, нужны ли другие типы Interaction
    interaction: ChatInputCommandInteraction<"cached">
) => Promise<InteractionResponse<boolean> | Message<boolean> | undefined>;

export type AutocompleteFunction = (
    interaction: AutocompleteInteraction<"cached">
) => void;

export type Command = {
    data:
        | SlashCommandBuilder
        | SlashCommandOptionsOnlyBuilder
        | SlashCommandSubcommandsOnlyBuilder;
    // TODO: подобрать тип получше, если это возможно
    execute: Execute;
    autocomplete?: AutocompleteFunction;
};

export type Commands = {
    [key: string]: Command;
};
