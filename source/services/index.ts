import { ClinicService } from './ClinicService';
import { FactoryService } from './FactoryService';
import { HospitalService } from './hospitalService';
import { HotelService } from './HotelService';
import { LogisticsService } from './LogisticsService';
import { SessionService } from './SessionService';
import { GitService } from './GitService';

export const clinicService = new ClinicService();
export const factoryService = new FactoryService();
export const hospitalService = new HospitalService();
export const hotelService = new HotelService();
export const logisticsService = new LogisticsService();
export const sessionService = new SessionService();
export const gitService = new GitService({
    owner: 'EasyWebApp',
    repo: 'wuhan2020'
});
