import prisma from "@prisma/client";

const { PrismaClient} = prisma;

export const PrismaConnector = new PrismaClient();