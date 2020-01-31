import { DataItem, Place, Contact, User, Supplies } from './common';

export interface SuppliesRequirement extends DataItem, Place {
    hospital?: string;
    url?: string;
    supplies?: Supplies[];
    contacts?: Contact[];
    remark?: string;
    creator?: User;
}
