"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (form.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
      }

      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+[\]{};:,.<>?]).{6,}$/;

      if (!passwordRegex.test(form.password)) {
        alert("La contraseña debe incluir al menos un número y un caracter especial");
        return;
      }

      if (res.ok) {
        alert("Usuario creado correctamente. Inicia sesión.");
        router.push("/login"); //redirige al login
      } else {
        alert(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-pink-600 mb-4">Registro</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3 text-gray-900 placeholder-gray-400"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3 text-gray-900 placeholder-gray-400"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3 text-gray-900 placeholder-gray-400"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white p-2 rounded hover:bg-pink-700"
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}
