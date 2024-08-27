import React from "react";
import { Trash2, Square, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Props = {
  description: string | null;
  isComplete: boolean;
  onDelete: () => void;
  toggleCompletion: () => void;
};

export const TodoItem = (props: Props) => {
  return (
    <div className="bg-white rounded-lg shadow mb-2 overflow-hidden">
      <div className="flex items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-4"
          onClick={props.toggleCompletion}
        >
          {props.isComplete ? (
            <CheckSquare className="h-5 w-5" />
          ) : (
            <Square className="h-5 w-5" />
          )}
        </Button>
        <div
          className="flex-grow cursor-pointer"
          onClick={props.toggleCompletion}
        >
          <p
            className={`text-base ${
              props.isComplete ? "line-through text-gray-500" : ""
            }`}
          >
            {props.description}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={props.onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
