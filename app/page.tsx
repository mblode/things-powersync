"use client";
import { useQuery, useStatus } from "@powersync/react";

export default function Page() {
  const status = useStatus();
  const { data: todos } = useQuery("SELECT id, description FROM todos");

  if (!status.hasSynced) {
    return (
      <div>
        <p>
          Syncing down from the backend. This will load indefinitely if you have
          not set up the connection correctly. Check the console for issues.
        </p>
      </div>
    );
  }

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>{todo.description}</div>
      ))}
    </div>
  );
}
