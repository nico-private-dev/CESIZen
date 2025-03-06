import { IUser } from './user';

export interface ProfileInfoProps {
    user: IUser;
    activeSection?: 'info' | 'security';
}