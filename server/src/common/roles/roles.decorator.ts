import { SetMetadata } from "@nestjs/common";
// Setup para roles guard
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);