import { globalStore } from "store";
import { Execute } from "types";

export const showall: Execute = async (interaction) => {
    return interaction.editReply(
        `${globalStore.takenNames.map((name) => `- **${name}**`).join("\n")}`
    );
};
