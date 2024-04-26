'use client';

import { NextAuthOptions } from 'next-auth';
import FaceBookProvider from 'next-auth/providers/facebook';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: process.env.NEXTAUTH_SECRET,

  // Configure one or more authentication providers
  providers: [
    FaceBookProvider({
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            'page_manage_engagement,pages_manage_posts,pages_read_engagement,pages_read_user_content,pages_show_list,public_profile,email,public_profile',
        },
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
};
