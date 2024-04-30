import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDB } from '@/lib/database';
// import User from '@/lib/database/models/user.model';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getServerSession } from 'next-auth';

const login = async (credentials: Record<'email', string> | undefined) => {
  try {
    await connectToDB();
    if (!credentials?.email) throw new Error('email has not been found');

    // const user = await User.findOne({ email: credentials!.email });

    // if (!user) {
    //   throw new Error('email has not been found');
    // }

    // return user;
  } catch (err) {
    throw new Error('Failed to login');
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {},
        _id: {},
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
    async session({ session, trigger, newSession }) {
      await connectToDB();
      if (session?.user?.email) {
        const sessionUser = await User.findOne({
          email: session.user.email,
        });
        if (sessionUser) {
          session.user._id = sessionUser._id.toString();
          session.user.username = sessionUser.username;
          session.user.first_name = sessionUser.first_name;
          session.user.last_name = sessionUser.last_name;
          session.user.photo = sessionUser.photo;
          session.user.isAdmin = sessionUser.isAdmin as boolean;
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
