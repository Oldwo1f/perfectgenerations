import { User } from '../../user/entities/user.entity';
import { Plan } from './plan.entity';
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    CANCELLED = "cancelled",
    PAST_DUE = "past_due",
    INCOMPLETE = "incomplete"
}
export declare class Subscription {
    id: string;
    userId: string;
    user: User;
    planId: string;
    plan: Plan;
    status: SubscriptionStatus;
    stripeSubscriptionId: string;
    currentPeriodEnd: Date;
    createdAt: Date;
}
