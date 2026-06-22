export interface PaginationQuery {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export function getPaginationOptions(query: PaginationQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy || "createdAt";
    const sortOrder: 1 | -1 = query.sortOrder === "asc" ? 1 : -1;

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
}
