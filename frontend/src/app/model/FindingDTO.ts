export class FindingDTO {
    id: number = 0;
    name: string = "";
    location: string = "";
    source: string = "";
    status: string = "";
    severity: string = "";
    inserted: string = "";
    last_seen: string= "";
}
interface Comment {
    inserted: string;
    message: string;
    author: string;
}

export class SingleFindingDTO {
    vulnsResponseDto: FindingDTO | undefined;
    description: string = "";
    recommendation: string = "";
    explanation: string = "";
    refs:string = "";
    comments: Comment[] = [];
}