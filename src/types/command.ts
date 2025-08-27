import {
    ChatInputCommandInteraction,
    InteractionResponse,
    Message,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export type Command = {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    // TODO: подобрать тип получше, если это возможно
    execute: (
        // TODO: посмотреть, нужны ли другие типы Interaction
        interaction: ChatInputCommandInteraction<"cached">
    ) => Promise<InteractionResponse<boolean> | Message<boolean> | undefined>;
};

export type Commands = {
    [key: string]: Command;
};
