export interface LlmSourceConfigRequest {
    source: string;
    enabled: boolean;
    apiUrl: string;
    apiKey: string;
    model: string;
    contextWindow: number;
    scanConcurrency: number;
    severities: string[];
}

export interface OtherConfigRequestDTO {
    geminiApiKey?: string;
}
