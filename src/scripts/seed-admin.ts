import "dotenv/config";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/db";

async function seedAdmin() {
  try {
    const client = await clientPromise;
    const db = client.db("talleresdb");
    const users = db.collection("users");

    // Verificar si ya existe el admin
    const existing = await users.findOne({ email: "admin@talleres.com" });
    if (existing) {
      console.log("Admin ya existe en la BD");
      return;
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Insertar admin
    await users.insertOne({
      nombre: "Admin",
      email: "admin@talleres.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Usuario admin creado exitosamente");
  } catch (err) {
    console.error("Error al crear admin:", err);
  } finally {
    process.exit();
  }
}

seedAdmin();