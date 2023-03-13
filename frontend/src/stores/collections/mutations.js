export const loadCollections = (state, collections) => {
    state.collections = collections;
};

export const addToCollection = (state, info) => {
    const collection = state.collections.find(collection => collection.id === info.collectionId);
    if (collection) {
        collection.content.push(info.content);
    }
};

export const removeFromCollection = (state, info) => {
    const collection = state.collections.find(collection => collection.id === info.collectionId);
    if (collection) {
        collection.content = collection.content.filter(picture => picture.id !== info.contentId);
    }
};

export const setCollection = (state, updatedCollection) => {
    state.collections = updatedCollection;
};
