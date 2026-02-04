import { Role } from '../../users/entities/role.entity';

export class LoginPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  roles: Role[];
}
