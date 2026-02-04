import { Role } from 'generated/prisma/client';

export class LoginPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  roles: Role[];
}
