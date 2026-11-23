import prisma from "../config/prisma.js";

export const destroyUserSessions = async (userId) => {
  await prisma.$executeRaw`
    DELETE FROM "user_sessions"
    WHERE sess::jsonb ->> 'userId' = ${userId}
  `;
};
