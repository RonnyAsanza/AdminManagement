export class ApplicationStatusViewModel{
    applicationStatusKey?: number;
    code?: string;
    name?: string;
    description?: string;
    systemStatus?:number;
    default?: number;
    editable?: number;
    enumID?: number;
}

export enum ApplicationStatusEnum {
    new = 'new',
    incomplete = 'incomplete',
    cancelled = 'cancelled',
    suspended = 'suspended',
    denied = 'denied',
    approved = 'approved',
    archived = 'archived',
    resubmission = 'resubmission',
    deleted = 'deleted',
    complete= 'complete',
    requestReady = 'request-ready',
}