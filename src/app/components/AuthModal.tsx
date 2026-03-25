"use client";

import LoginForm from "./LoginForm";

type AuthModalProps = {
  mode: "login" | "signup";
  onClose: () => void;
};

export default function AuthModal({ mode, onClose }: AuthModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "login" ? "Log In" : "Sign Up"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

      <LoginForm />
      </div>
    </div>
  );
}