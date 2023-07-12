type PlaceholderValue = Node | string | boolean | number | null | undefined;

type PlaceholderMap = Record<string, PlaceholderValue | PlaceholderValue[]>;

export interface EmelOptions {
	doc?: Document;
	multiline?: boolean;
	returnSingleChild?: boolean;
	placeholders?: PlaceholderValue | PlaceholderValue[] | PlaceholderMap;
}

export default function emel(
	str?: string,
	options?: PlaceholderValue | PlaceholderValue[] | (EmelOptions & { returnSingleChild?: false })
): DocumentFragment;

export default function emel(
	str: string,
	options: EmelOptions & { returnSingleChild: true }
): Node;

export default class emel {
	constructor(options?: EmelOptions);
	emel: typeof emel;
}
