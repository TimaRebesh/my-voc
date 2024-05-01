import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { UserType } from '@/lib/database/models/user.model';

interface ProfileType {
  picture: string;
}
declare module 'next-auth' {
  interface User extends UserType {}
  interface Session {
    user: User;
  }

  interface LoginInputs {
    email: string;
    password: string;
  }

  interface LoginError {
    type: 'email' | 'password';
    message: string;
  }
}
