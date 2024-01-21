export class PermitStatusViewModel{
    permitStatusKey?: number;
    code?: string;
    name?: string;
    description?: string;
    systemStatus?:number;
    default?: number;
    enumID?: number;
}

export enum PermitStatusEnum {
    new = 'new',
    paymentPending= 'payment-pending',
    paymentFailed= 'payment-failed',
    issued = 'issued',
    active = 'active',
    expired = 'expired',
    cancelled = 'cancelled',
    suspended = 'suspended',
    archived = 'archived',
    paymentAccepted = 'payment-accepted',
}
  