// models/vulnerability.model.ts
export interface Vulnerability {
    id: number;
    name: string;
    source: string;
    location: string;
    severity: string;
    inserted: string;
    last_seen: string;
    status: string;
}

export interface SingleFindingDTO {
    vulnsResponseDto?: Vulnerability;
    description?: string;
    recommendation?: string;
    explanation?: string;
    refs?: string;
    comments?: Comment[];
}

export interface Comment {
    id: number;
    message: string;
    author: string;
    inserted: string;
}

// models/repo.model.ts
export interface Repo {
    id: number;
    name: string;
    repourl: string;
    insertedDate: string;
    defaultBranch: Branch;
    branches: Branch[];
    team?: Team;
    languages: { [name: string]: number };
    appDataTypes: AppDataType[];
    components: any[];
    scanInfos: ScanInfo[];
    sastScan: string;
    scaScan: string;
    secretsScan: string;
    iacScan: string;
    dastScan: string;
    gitlabScan: string;
}

export interface Branch {
    id: string;
    name: string;
}

export interface Team {
    id: number;
    name: string;
    remoteIdentifier: string | null;
    users: TeamUser[];
}

export interface TeamUser {
    id: number;
    username: string;
}

// models/finding-stats.model.ts
export interface FindingSourceStatDTO {
    sast: number;
    sca: number;
    secrets: number;
    iac: number;
    dast: number;
}

export interface FindingDTO {
    // Properties will depend on your API
}

export interface CodeRepoFindingStats {
    id: number;
    dateInserted: string;
    sastCritical: number;
    sastHigh: number;
    sastMedium: number;
    sastRest: number;
    scaCritical: number;
    scaHigh: number;
    scaMedium: number;
    scaRest: number;
    iacCritical: number;
    iacHigh: number;
    iacMedium: number;
    iacRest: number;
    secretsCritical: number;
    secretsHigh: number;
    secretsMedium: number;
    secretsRest: number;
    gitlabCritical: number;
    gitlabHigh: number;
    gitlabMedium: number;
    gitlabRest: number;
    openedFindings: number;
    removedFindings: number;
    reviewedFindings: number;
    averageFixTime: number;
    dastCritical: number;
    dastHigh: number;
    dastMedium: number;
    dastRest: number;
}

// models/privacy.model.ts
export interface AppDataType {
    id: number;
    categoryName: string;
    name: string;
    categoryGroups: string[];
    location: { [key: string]: string };
}

export interface GroupedAppDataType {
    categoryGroup: string;
    appDataTypes: AppDataType[];
}

// models/scan-info.model.ts
export interface ScanInfo {
    id: number;
    codeRepoBranch: Branch;
    commitId: string;
    insertedDate: string;
    sastCritical: number;
    sastHigh: number;
    sastMedium: number;
    sastRest: number;
    scaCritical: number;
    scaHigh: number;
    scaMedium: number;
    scaRest: number;
    iacCritical: number;
    iacHigh: number;
    iacMedium: number;
    iacRest: number;
    secretsCritical: number;
    secretsHigh: number;
    secretsMedium: number;
    secretsRest: number;
    dastCritical: number;
    dastHigh: number;
    dastMedium: number;
    dastRest: number;
    gitlabCritical: number;
    gitlabHigh: number;
    gitlabMedium: number;
    gitlabRest: number;
}

// models/chart.model.ts
export interface LanguageInfo {
    name: string;
    value: number;
    color: string;
}