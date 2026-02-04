import { Role } from '../../modules/users/entities/role.entity';
import { Request } from 'express';

export type TokenProps = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
};

export interface AuthRequest extends Request {
  user?: TokenProps;
}
