"use client";

import React from "react";
import { usePowerSync, useStatus } from "@powersync/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { TodoLists } from "@/components/todo/todo-lists";
import { LISTS_TABLE } from "@/lib/powersync/app-schema";
import { createClient } from "@/lib/supabase/client";
import { useToken } from "@/lib/supabase/use-token";

export default function TodoListsPage() {
  const powerSync = usePowerSync();
  const { user } = useToken();
  const status = useStatus();
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [newListName, setNewListName] = React.useState("");

  const createNewList = async (name: string) => {
    const userID = user?.id;

    if (!userID) {
      throw new Error(`Could not create new lists, no userID found`);
    }

    const res = await powerSync.execute(
      `INSERT INTO ${LISTS_TABLE} (id, created_at, name, owner_id) VALUES (uuid(), datetime(), ?, ?) RETURNING *`,
      [name, userID]
    );

    const resultRecord = res.rows?.item(0);

    if (!resultRecord) {
      throw new Error("Could not create list");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createNewList(newListName);
    setShowPrompt(false);
    setNewListName("");
  };

  return (
    <div className="relative p-4">
      <Button
        className="fixed bottom-6 right-6 rounded-full"
        size="icon"
        onClick={() => setShowPrompt(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <div>
        {/* <SearchBarWidget /> */}
        {!status.hasSynced ? (
          <p className="text-center mt-4">Busy with sync...</p>
        ) : (
          <TodoLists />
        )}
      </div>

      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Todo List</DialogTitle>
            <DialogDescription>
              Enter a name for a new todo list
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List Name"
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
}
