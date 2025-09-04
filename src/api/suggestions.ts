import { DataSnapshot, get, push, ref, remove, set } from "firebase/database";
import { globalStore } from "store";
import { SuggestedTrack } from "types";

export const addSuggestion = (suggestion: SuggestedTrack): Promise<void> => {
    const suggestionsRef = ref(
        globalStore.database,
        `suggestions/${globalStore.guildID}`
    );
    const newSuggestionRef = push(suggestionsRef);
    return set(newSuggestionRef, suggestion);
};

export const deleteSuggestion = (id: string): Promise<void> => {
    const suggestionRef = ref(
        globalStore.database,
        `suggestions/${globalStore.guildID}/${id}`
    );
    return remove(suggestionRef);
};

export const getAllSuggestions = (): Promise<DataSnapshot> => {
    const suggestionsRef = ref(
        globalStore.database,
        `suggestions/${globalStore.guildID}`
    );
    return get(suggestionsRef);
};
