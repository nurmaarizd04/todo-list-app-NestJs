export function checkStringIsAvailable(value: string | null | undefined): boolean {
        return value !== undefined && value !== null && value.length > 0;
}

export function checkNumberIsAvailable(value: number | null | undefined): boolean {
        return value !== undefined && value !== null;
}

export function checkBooleanIsAvailable(value: boolean | null | undefined): boolean {
        return value !== undefined && value !== null;
}

export function compareStringIsDiff(current: string | null | undefined, latest: string | null | undefined): boolean {
        if (checkStringIsAvailable(latest)) {
                return current !== latest;
        }

        return false;
}

export function compareNumberIsDiff(current: number | null | undefined, latest: number | null | undefined): boolean {
        if (checkNumberIsAvailable(latest)) {
                return current !== latest;
        }

        return false;
}

export function compareBooleanIsDiff(current: boolean | null | undefined, latest: boolean | null | undefined): boolean {
        if (checkBooleanIsAvailable(latest)) {
                return current !== latest;
        }

        return false;
}
