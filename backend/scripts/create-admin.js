import prisma from "../src/config/prisma.js";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

try {
  console.log("\n=== CREAR ADMINISTRADOR DE ACADIX ===\n");

  const firstName = (await rl.question("Nombre: ")).trim();
  const lastName = (await rl.question("Apellido: ")).trim();
  const email = (await rl.question("Correo: ")).trim().toLowerCase();
  const password = await rl.question("Contraseña: ");

  if (!firstName || !lastName || !email || !password) {
    throw new Error("Todos los campos son obligatorios.");
  }

  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Ya existe un usuario con ese correo.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("\nAdministrador creado correctamente.");
  console.log(`Correo: ${user.email}`);
  console.log(`Nombre: ${user.firstName} ${user.lastName}`);
  console.log(`Rol: ${user.role}`);
} catch (error) {
  console.error("\nError:", error.message);
  process.exitCode = 1;
} finally {
  rl.close();
  await prisma.$disconnect();
}
