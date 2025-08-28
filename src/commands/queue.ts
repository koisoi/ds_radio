import { noAccessMessage } from "const";
import { SlashCommandBuilder } from "discord.js";
import { globalStore } from "store";
import { Execute } from "types";
import { isPermittedMember } from "utils";

export const data = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Показать очередь воспроизведения");

export const execute: Execute = async (interaction) => {
    await interaction.deferReply({ flags: "Ephemeral" });

    if (!isPermittedMember(interaction.member)) {
        return interaction.editReply(noAccessMessage);
    }

    const queue =
        globalStore.distubeClient.getQueue(interaction.guild)?.songs || [];
    let printedQueue = "";
    for (let i = 0; i < queue.length; i++) {
        printedQueue += `${i + 1}. **${queue[i].name || "Без названия"}**: \`${
            queue[i].url || "No link"
        }\`\n`;
    }

    return interaction.editReply(
        `⏯️  **Очередь воспроизведения:**\n\n${
            printedQueue.length ? printedQueue : "Очередь пуста!"
        }`
    );
};
