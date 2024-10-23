import { Injectable } from '@nestjs/common';

import { User } from '@entity/user.entity';
import { AppLogger } from '@config/logger/app-logger.config';
import { FetchUserReq } from './dto/req/fetch-user.req';
import { NotFoundException } from '@exception/not-found.exception';
import { RoleService } from '../role/role.service';
import { UserRoleService } from '../user-role/user-role.service';
import { UserRole } from '@entity/user-role.entity';
import { ValidatorException } from '@exception/validator.exception';
import { ErrorCode } from '@share/constant/error-code';
import { EncryptionUtil } from '@util/encryption.util';
import { UserService } from '@module/user/user.service';
import { Transactional } from 'typeorm-transactional';
import { CtxReq } from '@security/request-context/request-context.dto';
import { UserCreateReq } from '@module/user/dto/req/user-create.req';
import { Page } from '@share/page/page';
import { PageRequest } from '@share/page/page-request';

@Injectable()
export class UserBloc {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(UserBloc.name);
  }

  @Transactional()
  async createUser({ userId: currentUserId }: CtxReq, req: UserCreateReq): Promise<number> {
    const { username, password, name, roles: rolesNames } = req;
    this.log.info(`Create user with username #${username}, name #${name} and roles #${rolesNames}`);
    const existUser = await this.userService.getByUsername(username);
    if (existUser) {
      throw new ValidatorException(
        `User with username #${username} already exists`,
        ErrorCode.USER_ALREADY_EXIST,
      );
    }
    const passwordHash = await EncryptionUtil.generateHash(password);

    const user = await this.userService.save({
      username,
      password: passwordHash,
      name,
      createdBy: currentUserId,
      updatedBy: currentUserId,
    } as unknown as User);
    const { id: userId } = user;

    const roles = await this.roleService.fetchByNames(rolesNames);
    for (const role of roles) {
      await this.userRoleService.save({
        userId,
        roleId: role.id,
        createdBy: currentUserId,
        updatedBy: currentUserId,
      } as UserRole);
    }
    return userId;
  }

  async searchUsers(req: FetchUserReq): Promise<Page<User>> {
    this.log.info(`Fetch all users by req #`, req);
    const { keyword } = req;
    const pageRequest = PageRequest.ofRequest(req);
    return this.userService.fetchUsers(keyword, pageRequest);
  }

  async getById(id: number): Promise<User> {
    this.log.info(`Get user by id #${id}`);
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }
    return user;
  }

  async getCurrentUserProfile(currentUserId: number): Promise<User> {
    this.log.info(`Get current user profile by currentUserId #${currentUserId}`);
    return this.userService.getById(currentUserId);
  }

  async changePassword(currentUserId: number, currentPassword: string, newPassword: string) {
    this.log.info(`Change password by currentUserId #${currentUserId}`);
    const user = await this.userService.getById(currentUserId);
    if (!(await EncryptionUtil.verifyHash(currentPassword, user.password))) {
      throw new ValidatorException('Invalid currentPassword', ErrorCode.WRONG_PASSWORD);
    }
    const newPasswordHash = await EncryptionUtil.generateHash(newPassword);
    await this.userService.save({
      ...user,
      password: newPasswordHash,
    } as User);
  }
}
