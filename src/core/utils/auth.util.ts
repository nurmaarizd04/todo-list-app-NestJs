export function getBearerToken(authHeader?: string): string {
        if (!authHeader) {
                throw new Error("Authorization header missing");
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
                throw new Error("Invalid Authorization header format");
        }

        return parts[1];
}
