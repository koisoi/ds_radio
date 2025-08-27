import { config } from "config";
import { GuildMember } from "discord.js";

export const isPermittedMember = (member: GuildMember): boolean => {
    return (
        member.id === config.ADMIN_ID ||
        member.id === config.CREATOR_ID ||
        member.roles.cache.has(config.DEV_PERMISSIVE_ROLE_ID) ||
        member.roles.cache.has(config.PERMISSIVE_ROLE_ID)
    );
};
