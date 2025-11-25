import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleProvider = (googleClientId && googleClientSecret)
  ? GoogleProvider({
    clientId: googleClientId,
    clientSecret: googleClientSecret,
  })
  : null;

const missingConfigHandler = async () => NextResponse.json({
  error: 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.'
}, { status: 500 });

const configuredHandler = googleProvider ? NextAuth({
  providers: [
    googleProvider,
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider !== 'google' || !user.email) {
          return false;
        }

        await connectDB();
        const email = user.email.toLowerCase();
        let existingUser = await User.findOne({ email });
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@mimsc.ma').toLowerCase();

        if (!existingUser) {
          console.log('Google sign-in: creating new user for', email);
          const givenName = (profile as any)?.given_name || user.name?.split(' ')?.[0] || 'Google';
          const familyName = (profile as any)?.family_name || user.name?.split(' ')?.slice(1)?.join(' ') || 'User';

          existingUser = new User({
            firstName: givenName,
            lastName: familyName,
            email,
            password: null,
            position: 'Member',
            userType: 'RESEARCHER',
            avatar: user.image || '',
            isActive: true,
            approvalStatus: 'PENDING',
            role: email === adminEmail ? 'ADMIN' : 'USER'
          });
          await existingUser.save();
          console.log('Google sign-in: user created with id', existingUser._id.toString());
        } else {
          // Keep profile data up to date on sign-in
          const updates: any = {};
          if (user.image && existingUser.avatar !== user.image) {
            updates.avatar = user.image;
          }
          // For pre-created users, auto-approve on first Google sign-in and activate the account
          if (existingUser.approvalStatus !== 'APPROVED') {
            updates.approvalStatus = 'APPROVED';
          }
          if (existingUser.isActive === false) {
            updates.isActive = true;
          }
          if (email === adminEmail && existingUser.role !== 'ADMIN') {
            updates.role = 'ADMIN';
          }
          if (Object.keys(updates).length > 0) {
            await User.findByIdAndUpdate(existingUser._id, updates);
          }
        }

        const roleFromDb = (existingUser.role || '').toString().toUpperCase();
        const isConfiguredAdmin = email === adminEmail;
        const finalRole = roleFromDb === 'ADMIN' || isConfiguredAdmin ? 'ADMIN' : (roleFromDb || 'USER');

        (user as any).id = existingUser._id.toString();
        (user as any).role = finalRole;
        (user as any).userType = existingUser.userType;
        (user as any).position = existingUser.position;
        (user as any).approvalStatus = existingUser.approvalStatus;
        console.log('Google sign-in: success for', email, 'approvalStatus=', (user as any).approvalStatus);
        return true;
      } catch (error) {
        console.error('Google sign-in error:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@mimsc.ma').toLowerCase();
      if (user) {
        token.sub = (user as any).id || token.sub;
        (token as any).role = ((user as any).role || 'USER').toString().toUpperCase();
        (token as any).userType = (user as any).userType || 'RESEARCHER';
        (token as any).position = (user as any).position || '';
        (token as any).approvalStatus = (user as any).approvalStatus || 'PENDING';
        token.email = user.email || token.email;
      }
      // ensure admin role is preserved for configured admin email
      if ((token.email || '').toLowerCase() === adminEmail) {
        (token as any).role = 'ADMIN';
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...(session.user || {}),
        id: token.sub as string,
        role: (token as any).role,
        userType: (token as any).userType,
        position: (token as any).position,
        approvalStatus: (token as any).approvalStatus
      } as any;
      return session;
    },
    async redirect({ baseUrl, token }) {
      const role = (token as any)?.role;
      if (role === 'ADMIN') {
        return `${baseUrl}/portal`;
      }
      return `${baseUrl}/user`;
    }
  }
}) : null;

const handler = configuredHandler || missingConfigHandler;

export { handler as GET, handler as POST };
