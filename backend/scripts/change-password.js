import prisma from "../src/config/prisma.js";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

try {
  console.log("\n=== CAMBIAR CONTRASEÑA DE ACADIX ===\n");

  const email = (await rl.question("Correo del usuario: "))
    .trim()
    .toLowerCase();

  const password = await rl.question("Nueva contraseña: ");
  const confirmation = await rl.question("Confirmar contraseña: ");

  if (!email || !password || !confirmation) {
    throw new Error("Todos los campos son obligatorios.");
  }

  if (password.length < 12) {
    throw new Error("La contraseña debe tener al menos 12 caracteres.");
  }

  if (password !== confirmation) {
    throw new Error("Las contraseñas no coinciden.");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("No existe un usuario con ese correo.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  console.log("\nContraseña actualizada correctamente.");
} catch (error) {
  console.error("\nError:", error.message);
  process.exitCode = 1;
} finally {
  rl.close();
  await prisma.$disconnect();
}
