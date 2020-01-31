import { DataItem, Contact } from './common';

export interface Clinic extends DataItem {
    name?: string;
    url?: string;
    contacts?: Contact;
    time?: string;
}
