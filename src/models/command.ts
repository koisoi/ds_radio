import {
    CommandInteraction,
    InteractionResponse,
    Message,
    SlashCommandBuilder,
} from "discord.js";

export type Command = {
    data: SlashCommandBuilder;
    // TODO: подобрать тип получше, если это возможно
    execute: (
        interaction: CommandInteraction
    ) => Promise<InteractionResponse<boolean> | Message<boolean> | undefined>;
};

export type Commands = {
    [key: string]: Command;
};
