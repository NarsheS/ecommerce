import { SetMetadata } from '@nestjs/common';
// Setup para public
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
