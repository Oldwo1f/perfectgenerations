declare class Background {
    name: string;
    url: string;
}
declare class Icon {
    name: string;
    class: string;
}
declare class ImageUrl {
    name: string;
    url: string;
}
declare class ImageGroup {
    groupName: string;
    images_url: ImageUrl[];
}
export declare class CreateBrandDto {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
    titleFont: string;
    textFont: string;
    tertiaryFont: string;
    logoUrl: string;
    textColor: string;
    textColor2: string;
    backgrounds: Background[];
    icons: Icon[];
    imageGroups: ImageGroup[];
}
export {};
