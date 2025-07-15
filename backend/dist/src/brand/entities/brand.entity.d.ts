import { User } from '../../user/entities/user.entity';
interface Background {
    name: string;
    url: string;
}
interface Icon {
    name: string;
    class: string;
}
interface ImageGroup {
    groupName: string;
    images_url: string[];
}
export declare class Brand {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
    titleFont: string;
    textFont: string;
    tertiaryFont: string;
    logoUrl: string;
    backgrounds: Background[];
    icons: Icon[];
    imageGroups: ImageGroup[];
    textColor: string;
    textColor2: string;
    userId: string;
    user: User;
}
export {};
