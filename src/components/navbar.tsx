"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import LogoutButton from "./logout-button";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50 p-4">
      <Container className="py-3">
        <div className="flex items-center justify-between">
          <Link
            href={isAuthenticated ? "/" : ""}
            className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
          >
            <h1>Twitter</h1>
          </Link>
          <div className="flex items-center space-x-2 md:space-x-6">
            {isAuthenticated && (
              <>
                <Link
                  href="/post/create"
                  className="text-gray-600 hover:text-gray-900 hover:underline transition-colors font-medium"
                >
                  New Post
                </Link>
                <Link
                  href="/user/edit"
                  className="text-gray-600 hover:text-gray-900 hover:underline transition-colors font-medium"
                >
                  Edit User
                </Link>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
