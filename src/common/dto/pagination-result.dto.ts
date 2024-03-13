interface Pagination {
    total: number;
    limit: number;
    prev: string | null;
    next: string | null;
}

export class PaginationResultDto {

    public pagination: Pagination
    public result: any[];

    public constructor(pagination: Pagination, result: any[]) {
        this.pagination = pagination;
        this.result = result;
    }

}
