import { config } from "config";
import { deployCommands } from "./deployCommands";

deployCommands({ guildID: config.DISCORD_DEV_GUILD_ID });
deployCommands({ guildID: config.DISCORD_CATS_SHIP_GUILD_ID });
