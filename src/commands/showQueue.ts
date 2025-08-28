import { SlashCommandBuilder } from "discord.js";
import { globalStore } from "index";
import { Execute } from "types";

export const data = new SlashCommandBuilder()
    .setName("showqueue")
    .setDescription("Показать очередь воспроизведения");

export const execute: Execute = async (interaction) => {
    await interaction.deferReply();

    const queue = globalStore.playerQueue.getArray();
    let printedQueue = "";
    for (let i = 0; i < queue.length; i++) {
        printedQueue += `${i + 1}. ${queue[i].title || "Без названия"}: ${
            queue[i].ytLink
        }\n`;
    }

    return interaction.editReply(
        `⏯️  **Очередь воспроизведения:**\n\n\`\`\`${
            printedQueue.length ? printedQueue : "Очередь пуста!"
        }\`\`\``
    );
};
