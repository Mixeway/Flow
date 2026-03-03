export interface DataUpdateLog {
    id: number;
    createdDate: Date;
    status: string;
    processed: number;
    error: number;
    fileExists: boolean;
}