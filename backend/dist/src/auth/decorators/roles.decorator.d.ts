import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/entities/user.entity';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => ReturnType<typeof SetMetadata>;
