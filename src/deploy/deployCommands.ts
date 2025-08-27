import { commands } from "commands";
import { config } from "config";
import { REST, Routes } from "discord.js";
import { logger } from "utils";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST(/*{version: "10"}*/).setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
    guildID: string;
};

export const deployCommands = async ({ guildID }: DeployCommandsProps) => {
    try {
        logger.log("Deploying commands...");

        await rest.put(
            Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildID),
            {
                body: commandsData,
            }
        );

        logger.success("Commands are deployed successfully!");
    } catch (error) {
        logger.error(`Error: ${error}`);
    }
};
