"use client";

import React, { Suspense } from "react";
import { usePowerSync, useQuery } from "@powersync/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import {
  LISTS_TABLE,
  type TodoRecord,
  TODOS_TABLE,
} from "@/lib/powersync/app-schema";
import { TodoItem } from "@/components/todo/todo-item";
import { useToken } from "@/lib/supabase/use-token";

const TodoEditSection = ({ listID }: { listID: string }) => {
  const powerSync = usePowerSync();
  const { user } = useToken();

  const {
    data: [listRecord],
  } = useQuery<{ name: string }>(
    `SELECT name FROM ${LISTS_TABLE} WHERE id = ?`,
    [listID]
  );

  const { data: todos } = useQuery<TodoRecord>(
    `SELECT * FROM ${TODOS_TABLE} WHERE list_id=? ORDER BY created_at DESC, id`,
    [listID]
  );

  const [showPrompt, setShowPrompt] = React.useState(false);
  const [newTodoName, setNewTodoName] = React.useState("");

  const toggleCompletion = async (record: TodoRecord, completed: boolean) => {
    const updatedRecord = { ...record, completed: completed };
    if (completed) {
      const userID = user?.id;
      if (!userID) {
        throw new Error(`Could not get user ID.`);
      }
      updatedRecord.completed_at = new Date().toISOString();
      updatedRecord.completed_by = userID;
    } else {
      updatedRecord.completed_at = null;
      updatedRecord.completed_by = null;
    }
    await powerSync.execute(
      `UPDATE ${TODOS_TABLE}
              SET completed = ?,
                  completed_at = ?,
                  completed_by = ?
              WHERE id = ?`,
      [
        completed,
        updatedRecord.completed_at,
        updatedRecord.completed_by,
        record.id,
      ]
    );
  };

  const createNewTodo = async (description: string) => {
    const userID = user?.id;

    if (!userID) {
      throw new Error(`Could not get user ID.`);
    }

    await powerSync.execute(
      `INSERT INTO
                ${TODOS_TABLE}
                    (id, created_at, created_by, description, list_id)
                VALUES
                    (uuid(), datetime(), ?, ?, ?)`,
      [userID, description, listID]
    );
  };

  const deleteTodo = async (id: string) => {
    await powerSync.writeTransaction(async (tx) => {
      await tx.execute(`DELETE FROM ${TODOS_TABLE} WHERE id = ?`, [id]);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createNewTodo(newTodoName);
    setShowPrompt(false);
    setNewTodoName("");
  };

  if (!listRecord) {
    return (
      <div className="p-4">
        <p className="text-center">
          No matching List found, please navigate back...
        </p>
      </div>
    );
  }

  return (
    <div className="relative p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List: {listRecord.name}</h1>
      <Button
        className="fixed bottom-6 right-6 rounded-full"
        size="icon"
        onClick={() => setShowPrompt(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
      <div>
        <ul className="space-y-2">
          {todos.map((r) => (
            <TodoItem
              key={r.id}
              description={r.description}
              onDelete={() => deleteTodo(r.id)}
              isComplete={r.completed == 1}
              toggleCompletion={() => toggleCompletion(r, !r.completed)}
            />
          ))}
        </ul>
      </div>
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Todo Item</DialogTitle>
            <DialogDescription>
              Enter a description for a new todo item
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Input
              value={newTodoName}
              onChange={(e) => setNewTodoName(e.target.value)}
              placeholder="Task Name"
              className="mt-2"
            />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPrompt(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function TodoEditPage({
  params,
}: {
  params: { todoId: string };
}) {
  return (
    <div className="p-4">
      <Suspense
        fallback={
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        }
      >
        <TodoEditSection listID={params.todoId} />
      </Suspense>
    </div>
  );
}
