import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/database';
import User from '@/lib/database/models/user.model';
import { AdapterUser } from 'next-auth/adapters';
import { Configurations } from '@/types';
import Vocabulary, { Word } from '@/lib/database/models/vocabularies.model';
import { UserFields } from '@/constants';
import { createUser } from '@/lib/actions/user.actions';

const login = async (
  credentials: Record<'email' | 'password', string> | undefined
) => {
  try {
    connectToDB();
    const user = await User.findOne({ email: credentials!.email });

    if (!user) {
      throw new Error('email has not been found');
    }

    const isPasswordCorrect = credentials!.password === user.password;

    if (!isPasswordCorrect) {
      throw new Error('Password is not correct');
    }

    return user;
  } catch (err) {
    throw new Error('Failed to login');
  }
};

const signInWithGoogle = async (googleUser: AdapterUser | any) => {
  try {
    await connectToDB();
    const { email, name, image } = googleUser;
    const user = await User.findOne({ email });
    if (!user) {
      await createUser({ email, name, image });
    }
  } catch (error: unknown) {
    console.log('Error checking if user exists: ', (error as Error).message);
    return false;
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        try {
          const user = await login(credentials);
          return user;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (profile && account?.provider === 'google') {
        signInWithGoogle(user);
      }
      return true;
    },
    async session({ session, trigger, newSession }) {
      await connectToDB();
      if (session?.user?.email) {
        const sessionUser = await User.findOne({
          email: session.user.email,
        });
        if (sessionUser) {
          session.user._id = sessionUser._id.toString();
          session.user.name = sessionUser.name;
          session.user.avatar = sessionUser.avatar;
          session.user.password = sessionUser.password;
          session.user.isAdmin = sessionUser.isAdmin;
          session.user.configuration = sessionUser.configuration;
        }
      }
      return session;
    },
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
