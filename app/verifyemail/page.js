"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyUserEmail = async (token) => {
    try {
      const response = await fetch("/api/users/verifyemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data?.success) {
        setVerified(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");

    if (!urlToken) {
      setError(true);
      setLoading(false);
      return;
    }

    setToken(urlToken);
  }, []);
  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail(token);
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md shadow-lg rounded-xl p-8 text-center">
        {/* ✅ Loading */}
        {loading && (
          <>
            <div className="animate-spin mx-auto mb-4 h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <h2 className="text-xl font-semibold text-gray-400">
              Verifying your email...
            </h2>
            <p className="text-gray-500 mt-2">Please wait a moment</p>
          </>
        )}

        {/* ✅ Success */}
        {!loading && verified && (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              ✅
            </div>
            <h2 className="text-2xl font-semibold text-green-600">
              Email Verified!
            </h2>
            <p className="text-gray-600 mt-2">
              Your email has been successfully verified.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
            >
              Continue to Login
            </Link>
          </>
        )}

        {/* ❌ Error */}
        {!loading && error && (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              ❌
            </div>
            <h2 className="text-2xl font-semibold text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-600 mt-2">
              The verification link is invalid or expired.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/"
                className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                Go Home
              </Link>
              <Link
                href="/resend-verification"
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
              >
                Try Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
