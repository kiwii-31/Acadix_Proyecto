import prisma from "./src/config/prisma.js";

try {
  await prisma.$connect();
  console.log("Conexión a PostgreSQL exitosa");
} catch (error) {
  console.error("Error de conexión:", error.message);
} finally {
  await prisma.$disconnect();
}
