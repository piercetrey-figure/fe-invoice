export const enumStringToHumanReadable = (input: string) =>
    input
        .split("_")
        .reduce(
            (res, word) =>
                `${res} ${word.charAt(0).toUpperCase()}${word
                        .substr(1)
                        .toLowerCase()}`,
            ""
        );
