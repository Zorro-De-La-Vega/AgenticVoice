import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongo";
import config from "@/config";
import { UserRole, IndustryType, AccountStatus } from "@/types/auth";

// Create authOptions without direct model imports to avoid webpack issues
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 465,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: config.resend.fromNoReply,
    }),
  ],
  // Use type assertion to handle adapter type compatibility
  adapter: MongoDBAdapter(clientPromise, {
    collections: {
      Accounts: "av_accounts",
      Sessions: "av_sessions", 
      Users: "av_users",
      VerificationTokens: "av_verification_tokens"
    }
  }) as any, // Type assertion to bypass strict type checking
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Dynamic import to avoid webpack bundling issues
        const { default: connectMongo } = await import("@/libs/mongoose");
        const { default: User } = await import("@/models/User");
        
        await connectMongo();
        
        await User.findOneAndUpdate(
          { email: user.email },
          { 
            lastLoginAt: new Date(),
            $inc: { loginCount: 1 }
          }
        );
      } catch (error) {
        console.error('Error updating user login info:', error);
      }
      return true;
    },
    
    async session({ session, token, user }) {
      if (session?.user) {
        try {
          // Dynamic imports to avoid webpack issues
          const { default: connectMongo } = await import("@/libs/mongoose");
          const { default: User } = await import("@/models/User");
          
          await connectMongo();
          
          const dbUser = await User.findOne({ email: session.user.email }).lean();
          
          if (dbUser) {
            session.user = {
              ...session.user,
              id: (dbUser as any)._id.toString(),
              role: (dbUser as any).role || UserRole.FREE,
              industryType: (dbUser as any).industryType || IndustryType.OTHER,
              accountStatus: (dbUser as any).accountStatus || AccountStatus.ACTIVE,
              hasAccess: (dbUser as any).hasAccess || false,
              customerId: (dbUser as any).customerId,
              priceId: (dbUser as any).priceId,
              company: (dbUser as any).company,
              preferences: (dbUser as any).preferences,
              isEmailVerified: (dbUser as any).isEmailVerified || false,
              isTwoFactorEnabled: (dbUser as any).isTwoFactorEnabled || false,
            };
          }
        } catch (error) {
          console.error('Error fetching user session data:', error);
        }
      } else if (session?.user) {
        // Fallback for when no database connection
        session.user = {
          ...session.user,
          role: UserRole.FREE,
          industryType: IndustryType.OTHER,
          accountStatus: AccountStatus.ACTIVE,
          hasAccess: false,
        };
      }
      
      return session;
    },
    
    jwt({ token, user, account }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser && user.email) {
        try {
          // Dynamic imports to avoid webpack issues
          const { default: connectMongo } = await import("@/libs/mongoose");
          const { default: User } = await import("@/models/User");
          
          await connectMongo();
          
          // Set default values for new users
          await User.findOneAndUpdate(
            { email: user.email },
            {
              $setOnInsert: {
                role: UserRole.FREE,
                industryType: IndustryType.OTHER,
                accountStatus: AccountStatus.ACTIVE,
                hasAccess: false,
                createdAt: new Date(),
                preferences: {
                  emailNotifications: true,
                  smsNotifications: false,
                  newsletter: true,
                },
                isEmailVerified: account?.provider === 'google', // Auto-verify for Google users
              }
            },
            { upsert: true }
          );
        } catch (error) {
          console.error('Error setting up new user:', error);
        }
      }
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/login?error=true',
    newUser: '/welcome',
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  debug: process.env.NODE_ENV === 'development',
};
