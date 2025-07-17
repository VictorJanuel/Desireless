import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../index";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    basePath: '/api/auth',
    routes: {
        signUp: {
            email: '/sign-up/email',
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        minPasswordLength: 8,
        maxPasswordLength: 25,
    },
    debug: true, // enable internal logs
    logger: console,
});