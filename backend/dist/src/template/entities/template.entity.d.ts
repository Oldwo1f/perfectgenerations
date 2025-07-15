import { User } from '../../user/entities/user.entity';
export interface TemplateElement {
    id: string;
    type: 'text' | 'image' | 'shape' | 'icon';
    x: number;
    y: number;
    width: number;
    height: number;
    properties: Record<string, unknown>;
}
export interface TemplateLayout {
    width: number;
    height: number;
    elements: TemplateElement[];
}
export declare class Template {
    id: string;
    name: string;
    description: string;
    category: string;
    layout: TemplateLayout;
    tags: string[];
    isActive: boolean;
    html: string;
    variables: Record<string, string | {
        value: string;
        type: string;
    }>;
    brandVariables: Record<string, string>;
    previewImage: string;
    userId: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
