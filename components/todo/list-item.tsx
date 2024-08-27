import React from "react";
import { Trash2, ArrowRight, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type Props = {
  title: string;
  description: string;
  selected?: boolean;
  onDelete: () => void;
  onPress: () => void;
};

export const ListItem = (props: Props) => {
  return (
    <div className="bg-white rounded-lg shadow mb-2 overflow-hidden">
      <div className="flex items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-4"
          onClick={props.onPress}
        >
          <Avatar>
            <AvatarFallback>
              <ListOrdered className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
        <div
          className={`flex-grow cursor-pointer ${
            props.selected ? "bg-gray-100" : ""
          }`}
          onClick={props.onPress}
        >
          <h3 className="text-lg font-medium">{props.title}</h3>
          <p className="text-sm text-gray-500">{props.description}</p>
        </div>
        <div className="flex">
          <Button variant="ghost" size="icon" onClick={props.onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={props.onPress}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
