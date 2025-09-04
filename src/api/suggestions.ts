import { DataSnapshot, getDatabase } from "firebase-admin/database";
import { globalStore } from "store";
import { SuggestedTrack } from "types";

export const addSuggestion = (suggestion: SuggestedTrack): Promise<void> => {
    const suggestionsRef = getDatabase().ref(
        `suggestions/${globalStore.guildID}`
    );
    const newSuggestionRef = suggestionsRef.push();
    return newSuggestionRef.set(suggestion);
};

export const deleteSuggestion = (id: string): Promise<void> => {
    const suggestionRef = getDatabase().ref(
        `suggestions/${globalStore.guildID}/${id}`
    );
    return suggestionRef.remove();
};

export const getAllSuggestions = (): Promise<DataSnapshot> => {
    const suggestionsRef = getDatabase().ref(
        `suggestions/${globalStore.guildID}`
    );
    return suggestionsRef.get();
};
