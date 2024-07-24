export interface Framework {
    name: string;
    identifier: string;
    index?: number;
    code?: string;
    description?: string;
    type?: string;
    objectType?: string;
    categories?: FrameworkCategory[];
    translations?: string;
}

export interface FrameworkCategory {
    identifier: string;
    code: string;
    terms?: CategoryTerm[];
    translations?: string;
    name: string;
    description: string;
    index: number;
    status: string;
}

export interface CategoryTerm {
    associations?: CategoryAssociation[];
    identifier: string;
    code: string;
    translations?: string;
    name: string;
    description?: string;
    index: number;
    category: string;
    status: string;
    children?: CategoryAssociation[];
}

export interface CategoryAssociation {
    identifier: string;
    code: string;
    translations?: string;
    name: string;
    description?: string;
    category: string;
    status: string;
}

export interface Channel {
    identifier: string;
    code: string;
    consumerId: string;
    channel: string;
    description: string;
    frameworks?: Framework[];
    createdOn: string;
    versionKey: string;
    appId: string;
    name: string;
    lastUpdatedOn: string;
    defaultFramework: string;
    status: string;
}

