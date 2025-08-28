import { SlashCommandBuilder } from "discord.js";
import { globalStore } from "store";
import { Execute } from "types";

export const data = new SlashCommandBuilder()
    .setName("showqueue")
    .setDescription("Показать очередь воспроизведения");

export const execute: Execute = async (interaction) => {
    await interaction.deferReply();

    const queue =
        globalStore.distubeClient.getQueue(interaction.guild)?.songs || [];
    let printedQueue = "";
    for (let i = 0; i < queue.length; i++) {
        printedQueue += `${i + 1}. ${queue[i].name || "Без названия"}: ${
            queue[i].url || "No link"
        }\n`;
    }

    return interaction.editReply(
        `⏯️  **Очередь воспроизведения:**\n\`\`\`${
            printedQueue.length ? printedQueue : "Очередь пуста!"
        }\`\`\``
    );
};
