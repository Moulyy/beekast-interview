declare const brand: unique symbol

export type Branded<TBase, TBranded> = TBase & { readonly [brand]: TBranded }
