export type EditorState<TModel> = Readonly<{
    currentIndex: number
    history: readonly TModel[]
}>
