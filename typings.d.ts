type PlaceholderValue = string | string[];

type PlaceholderMap = Record<string, PlaceholderValue | boolean | null | undefined>;

export interface EmelOptions {
    doc?: Document;
    multiline?: boolean;
    returnSingleChild?: boolean;
    placeholders?: PlaceholderValue | Node | PlaceholderMap;
}

export default function emel(
    str?: string,
    options?: EmelOptions & { returnSingleChild?: false }
): DocumentFragment;

export default function emel(
    str: string,
    options: EmelOptions & { returnSingleChild: true }
): Node;
