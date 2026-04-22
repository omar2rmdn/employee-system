import { LoginForm } from "@/components/forms/login-form";

export default function Login() {
  return (
    <section className="flex *:flex-1 h-screen">
      <div className="bg-indigo-950 hidden lg:flex justify-center gap-4 flex-col p-16">
        <h1 className="text-white text-5xl font-bold">
          Employee <br /> Management System
        </h1>
        <p className="text-gray-400 text-lg">
          Streamline your workforce operations, track attendance, manage
          pyaroll, and empower your team securely.
        </p>
      </div>
      <LoginForm />
    </section>
  );
}
