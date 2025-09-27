"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";
import { logout } from "@/lib/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error cargando usuario:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <p className="p-8">Cargando...</p>;


    const handleLogout = () => {
      logout();
      router.push("/login");
    };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard de Usuario
        </h1>
        <button
          type="button"
          aria-label="Cerrar sesión"
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </div>

      {user ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card de perfil */}
          <div className="col-span-1 bg-white p-6 rounded-xl shadow">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {user.nombre}
                </p>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                Rol: {user.role}
              </span>
            </div>
          </div>

          {/* Card de estado de cuenta */}
          <div className="col-span-1 bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Estado de la cuenta
            </h2>
            <p className="text-gray-600">
              Último inicio de sesión:{" "}
              <span className="font-semibold">
                {new Date().toLocaleString()}
              </span>
            </p>
            <p className="text-gray-600 mt-2">
              Estado:{" "}
              <span className="text-green-600 font-semibold">Activo</span>
            </p>
          </div>

          {/* Card de accesos rápidos */}
          <div className="col-span-1 bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Accesos rápidos
            </h2>
            <div className="flex flex-col space-y-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Editar perfil
              </button>
              <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                Configuración
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>No se pudieron cargar los datos del usuario.</p>
      )}
    </div>
  );
}
