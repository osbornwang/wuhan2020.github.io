import { DataItem, User, Place, Contact } from './common';

export interface HotelCanStaying extends DataItem, Place {
    name?: string;
    address?: string;
    capacity?: number;
    contacts?: Contact[];
    creator?: User;
    url?: string;
}
