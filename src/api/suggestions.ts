import { noDataMessage, wrongFormatFromServerMessage } from "const";
import { getDatabase } from "firebase-admin/database";
import { globalStore } from "store";
import { isSuggestedTrackArray, SuggestedTrack } from "types";

export const addSuggestion = (suggestion: SuggestedTrack): Promise<void> => {
    return new Promise((resolve, reject) => {
        const suggestionsRef = getDatabase().ref(
            `suggestions/${globalStore.guildID}`
        );
        const newSuggestionRef = suggestionsRef.push();
        newSuggestionRef.set(suggestion).then(resolve).catch(reject);
    });
};

export const deleteSuggestion = (index: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        const suggestionsRef = getDatabase().ref(
            `suggestions/${globalStore.guildID}`
        );
        suggestionsRef
            .get()
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    reject(noDataMessage);
                }

                const suggestions = Object.keys(snapshot);
                if (suggestions[index] === undefined) {
                    reject(noDataMessage);
                } else {
                    const searchedSuggestionRef = suggestionsRef.child(
                        suggestions[index]
                    );
                    searchedSuggestionRef.remove().then(resolve).catch(reject);
                }
            })
            .catch(reject);
    });
};

export const getAllSuggestions = (): Promise<SuggestedTrack[]> => {
    return new Promise((resolve, reject) => {
        const suggestionsRef = getDatabase().ref(
            `suggestions/${globalStore.guildID}`
        );
        suggestionsRef
            .get()
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    resolve([]);
                }

                const suggestions = Object.values(snapshot);
                if (!isSuggestedTrackArray(suggestions)) {
                    reject(wrongFormatFromServerMessage);
                } else {
                    resolve(suggestions);
                }
            })
            .catch(reject);
    });
};
