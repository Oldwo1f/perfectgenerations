import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { ChangeUserPlanDto } from './dto/change-user-plan.dto';
export declare class AdminUserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<AdminUserResponseDto[]>;
    findOne(id: string): Promise<Partial<User>>;
    create(createUserDto: CreateUserDto): Promise<Partial<User>>;
    update(id: string, updateUserDto: AdminUpdateUserDto): Promise<Partial<User>>;
    updateStatus(id: string, updateStatusDto: UpdateUserStatusDto): Promise<Partial<User>>;
    remove(id: string): Promise<void>;
    changeUserPlan(id: string, changeUserPlanDto: ChangeUserPlanDto): Promise<AdminUserResponseDto>;
    private transformToAdminResponse;
}
