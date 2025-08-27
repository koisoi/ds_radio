import { Client, Guild } from "discord.js";

type GetGuildProps = {
    client: Client<boolean>;
    guildID: string;
};

// FIXME: оставила если будет нужна. если все работает без фетча - удалить файл
export const getGuild = async ({
    client,
    guildID,
}: GetGuildProps): Promise<Guild> => {
    let guild = client.guilds.cache.get(guildID);

    if (guild === undefined) {
        guild = await client.guilds.fetch(guildID);
    }

    return guild;
};
