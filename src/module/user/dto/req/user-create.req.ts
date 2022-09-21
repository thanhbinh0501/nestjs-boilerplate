import { IsEnum, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { RoleEnum } from '@share/enum/role.enum';

export class UserCreateReq {
  @IsNotEmpty()
  @ApiProperty()
  @Length(4, 20)
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Username can only contain letters and numbers' })
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty({ enum: RoleEnum, isArray: true })
  @IsEnum(RoleEnum, { each: true })
  roles: RoleEnum[];
}
