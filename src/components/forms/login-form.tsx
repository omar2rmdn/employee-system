"use client";

import { useActionState, useState } from "react";
import { loginUser } from "@/actions/auth";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginUser, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col justify-center p-8 md:p-16 lg:p-32">
      <h1 className="font-semibold text-4xl lg:text-5xl text-center mb-8">
        Login to Continue
      </h1>
      <form action={formAction} className="flex flex-col">
        {state?.error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-6 text-center">
            {state.error as string}
          </div>
        )}

        <label className="text-lg" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          required
          id="email"
          name="email"
          className="bg-gray-200 rounded p-3 outline-0 mt-1.5 mb-6 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />

        <label className="text-lg" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          required
          id="password"
          name="password"
          className="bg-gray-200 rounded p-3 outline-0 mt-1.5 mb-6 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
        <button
          type="submit"
          className="bg-indigo-950 py-3 rounded text-white font-semibold text-lg cursor-pointer disabled:bg-indigo-950/70 disabled:cursor-not-allowed"
          disabled={isPending || !email || !password}
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="my-4 text-gray-600 text-center">
        &#169; {new Date().getFullYear()}{" "}
        <a
          href="https://omar11dev.netlify.app/"
          className="font-semibold text-slate-800"
          target="_blank"
          rel="noreferrer"
        >
          Omar Ramadan
        </a>
        , All rights reserved
      </p>
    </div>
  );
}
