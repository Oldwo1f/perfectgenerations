import { BillingService } from './billing.service';
import { User } from '../user/entities/user.entity';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    getStorageInfo(user: User): Promise<import("./billing.service").StorageInfo>;
}
