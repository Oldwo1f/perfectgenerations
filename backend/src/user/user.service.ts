import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Plan } from '../billing/entities/plan.entity';
import { Subscription, SubscriptionStatus } from '../billing/entities/subscription.entity';
import { UsageStorage } from '../billing/entities/usage-storage.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UsageMonthly } from '../billing/entities/usage-monthly.entity';
import { Image } from '../images/entities/image.entity';
import { Brand } from '../brand/entities/brand.entity';
import { Template } from '../template/entities/template.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(UsageStorage)
    private usageStorageRepository: Repository<UsageStorage>,
    @InjectRepository(UsageMonthly)
    private usageMonthlyRepository: Repository<UsageMonthly>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private entityManager: EntityManager,
    private dataSource: DataSource,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    let user: User | null = null;

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const newUser = transactionalEntityManager.create(User, {
        ...registerUserDto,
        emailVerificationToken: crypto.randomBytes(32).toString('hex'),
      });

      await transactionalEntityManager.save(newUser);

      const freePlan = await transactionalEntityManager.findOne(Plan, {
        where: { id: 'free' },
      });

      if (!freePlan) {
        throw new InternalServerErrorException('Default "free" plan not found.');
      }

      const subscription = transactionalEntityManager.create(Subscription, {
        user: newUser,
        plan: freePlan,
        status: SubscriptionStatus.ACTIVE, // Free plan is active immediately
      });

      await transactionalEntityManager.save(subscription);

      // Create initial usage storage record
      const usageStorage = transactionalEntityManager.create(UsageStorage, {
        user: newUser,
        bytesUsed: 0,
      });

      await transactionalEntityManager.save(usageStorage);

      user = newUser;
    });

    if (!user) {
      // This should not happen if transaction is successful
      throw new InternalServerErrorException('Failed to create user.');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.findByEmail(loginUserDto.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(loginUserDto.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    if (user.status === UserStatus.PENDING_VERIFICATION) {
      user.status = UserStatus.ACTIVE;
      user.emailVerifiedAt = new Date();
      user.emailVerificationToken = null;
      await this.userRepository.save(user);
    } else if (user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('Account is not active');
    }

    return user;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    user.status = UserStatus.ACTIVE;
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = null;

    return this.userRepository.save(user);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.findByEmail(email);

    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;

    await this.userRepository.save(user);

    // TODO: Send email with reset token
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { passwordResetToken: token },
    });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await this.userRepository.save(user);
  }

  async generateApiKey(userId: string): Promise<string> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const apiKey = `pk_${crypto.randomBytes(32).toString('hex')}`;

    user.apiKey = apiKey;
    await this.userRepository.save(user);

    return apiKey;
  }

  async findByApiKey(apiKey: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { apiKey } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'status',
        'createdAt',
        'lastLoginAt',
      ],
      relations: ['subscription', 'subscription.plan', 'storageUsage', 'monthlyUsage'],
    });
  }

  async getTemplatesCount(userId: string): Promise<number> {
    return this.templateRepository.count({
      where: { userId },
    });
  }

  async getBrandsCount(userId: string): Promise<number> {
    return this.brandRepository.count({
      where: { userId },
    });
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.userRepository.delete(userId);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async adminUpdate(id: string, updateUserDto: AdminUpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatching = await user.validatePassword(currentPassword);
    if (!isPasswordMatching) {
      throw new BadRequestException('Invalid current password');
    }

    user.password = newPassword;
    await this.userRepository.save(user);
  }

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.status = status;
    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Delete related entities
      await this.subscriptionRepository.delete({ userId: id });
      await this.usageMonthlyRepository.delete({ userId: id });
      await this.usageStorageRepository.delete({ userId: id });
      await this.imageRepository.delete({ user: { id } });
      await this.brandRepository.delete({ user: { id } });
      await this.templateRepository.delete({ user: { id } });

      // Finally, delete the user
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} could not be deleted`);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async changeUserPlan(userId: string, planId: string): Promise<User> {
    console.log(`Changing plan for user ${userId} to plan ${planId}`);

    // Vérifier que le plan existe
    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscription'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log(`Current subscription plan: ${user.subscription?.planId || 'none'}`);

    // Si l'utilisateur n'a pas d'abonnement, en créer un nouveau
    if (!user.subscription) {
      console.log('Creating new subscription');
      const subscription = this.subscriptionRepository.create({
        userId: user.id,
        planId,
        status: SubscriptionStatus.ACTIVE,
      });
      await this.subscriptionRepository.save(subscription);
    } else {
      // Mettre à jour l'abonnement existant
      console.log(`Updating subscription from ${user.subscription.planId} to ${planId}`);

      // Forcer la mise à jour en base avec update()
      await this.subscriptionRepository.update({ id: user.subscription.id }, { planId: planId });
    }

    // Forcer le rechargement de l'utilisateur avec les relations
    // En utilisant queryBuilder pour éviter le cache de TypeORM
    const updatedUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.subscription', 'subscription')
      .leftJoinAndSelect('subscription.plan', 'plan')
      .leftJoinAndSelect('user.storageUsage', 'storageUsage')
      .leftJoinAndSelect('user.monthlyUsage', 'monthlyUsage')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!updatedUser) {
      throw new NotFoundException('User not found after plan change');
    }
    console.log('-------------------------------------------');
    console.log('updatedUser =>', updatedUser);
    console.log(`Updated subscription plan: ${updatedUser.subscription?.planId}`);
    console.log(`Updated plan name: ${updatedUser.subscription?.plan?.name}`);

    return updatedUser;
  }
}
