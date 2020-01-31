import { DataItem, Contact } from './common';

export interface ServiceArea {
    city: string;
    direction: 'in' | 'out' | 'both';
    personal: boolean;
}

export interface LogisticsItem extends DataItem {
    name?: string;
    url?: string;
    contacts?: Contact[];
    serviceArea?: ServiceArea[];
    remark?: string;
}
