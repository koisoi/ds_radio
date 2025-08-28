import { commands } from "commands";
import { config } from "config";
import { Client, GatewayIntentBits, Interaction } from "discord.js";
import { GlobalStore } from "store";
import { connectToRadioChannel, logger } from "utils";

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.once("clientReady", async () => {
    logger.log("Client is ready.");

    if (process.env.NODE_ENV === "development") {
        logger.warning("Radio bot runs in development mode now.");
    }

    const devGuild = client.guilds.cache.get(config.DISCORD_DEV_GUILD_ID);
    const catsShipGuild = client.guilds.cache.get(
        config.DISCORD_CATS_SHIP_GUILD_ID
    );

    // TODO: убрать коммент если добавлю на корабль
    if (devGuild === undefined /*|| catsShipGuild === undefined*/) {
        throw new Error("Could not get a guild from cache.");
    }

    logger.log("Fetching dev guild info...");
    // тип error?
    // TODO: выбрать между ролью с доступом и юзерами с доступом и убрать ненужный фетч
    devGuild?.members
        .fetch()
        .then(() => logger.success("Dev guild userlist fetched successfully!"))
        .catch((error: Error) =>
            logger.error(`Failed to get dev guild userlist: ${error.message}`)
        );

    devGuild?.roles
        .fetch()
        .then(() => logger.success("Dev guild roles fetched successfully!"))
        .catch((error: Error) =>
            logger.error(`Failed to get dev guild roles: ${error.message}`)
        );

    if (process.env.NODE_ENV !== "development") {
        logger.log("Fetching Cats' Ship guild info...");
        catsShipGuild?.members
            .fetch()
            .then(() =>
                logger.success("Cats' Ship userlist fetched successfully!")
            )
            .catch((error: Error) =>
                logger.error(
                    `Failed to get Cats' Ship userlist: ${error.message}`
                )
            );
        catsShipGuild?.roles
            .fetch()
            .then(() =>
                logger.success("Cats' Ship roles fetched successfully!")
            )
            .catch((error: Error) =>
                logger.error(`Failed to get Cats' Ship roles: ${error.message}`)
            );
    }

    if (process.env.NODE_ENV === "development") {
        connectToRadioChannel({ client, mode: "dev" });
    }
    // TODO: убрать коммент если добавлю на корабль
    /* else {
        connectToRadioChannel({client, mode: 'prod'})
        */
});

client.on("interactionCreate", async (interaction: Interaction) => {
    if (
        !interaction.isCommand() ||
        !interaction.isChatInputCommand() ||
        !interaction.inCachedGuild()
    ) {
        return;
    }

    const { commandName } = interaction;
    if (commands[commandName]) {
        commands[commandName].execute(interaction);
    }
});

client.on("error", async (error: Error) => {
    logger.error(error.message);
});

// FIXME: да, экспортировать глобальный стор прямо из индекс-файла это как будто бы очень по-еблански, но, во-первых, это помогает удостовериться в том что стор будет инициализирован ПОСЛЕ создания клиента и ПЕРЕД логином, а во-вторых - я пиздец заебалась с попытками заставить бота хавать ссылки с ютуба и оно наконец-то блять работает с помощью этого ебланского способа. докумекаю башкой до решения получше - обязательно перепишу эту хуйню.
export const globalStore = new GlobalStore(client);

client.login(config.DISCORD_TOKEN);
