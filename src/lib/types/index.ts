import { Role } from 'generated/prisma/client';
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
