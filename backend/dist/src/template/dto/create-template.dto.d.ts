import type { TemplateLayout } from '../entities/template.entity';
export declare class CreateTemplateDto {
    name: string;
    description?: string;
    category?: string;
    layout: TemplateLayout;
    tags?: string[];
    isActive?: boolean;
    html?: string;
    variables?: Record<string, string | {
        value: string;
        type: string;
    }>;
    previewImage?: string;
}
