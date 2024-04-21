import { EditorState } from "./EditorState"

export const select = {
    canRedo: (state: EditorState<unknown>) => state.currentIndex < state.history.length - 1,
    canSave: (state: EditorState<unknown>) =>
        state.currentIndex > 0 &&
        Boolean(state.history[state.currentIndex]) &&
        JSON.stringify(state.history[0]) !== JSON.stringify(state.history[state.currentIndex]),
    canUndo: (state: EditorState<unknown>) => state.currentIndex > 0,
    current: <TModel>(state: EditorState<TModel>) => state.history[state.currentIndex],
}
