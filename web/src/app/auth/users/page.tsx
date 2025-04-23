"use client";

import { useEffect, useState } from "react";
import { getUsers } from "./users.api";

function UsersPage() {
  interface User {
    id: number;
    email: string;
  }

  const [users, setUsers] = useState<User[]>([]);

  const handleGetUsers = async () => {
    const users = await getUsers();
    setUsers(users);
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  return (
    <div>
      {users.map((usr) => {
        return (
          <div key={usr.id}>
            <h1>{usr.email}</h1>
            <p>{usr.id}</p>
          </div>
        );
      })}
    </div>
  );
}

export default UsersPage;
