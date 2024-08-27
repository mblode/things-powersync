"use client";

import React from "react";
import { useQuery } from "@powersync/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DEFAULT_QUERY = "SELECT * FROM lists";

export default function SQLConsolePage() {
  const [query, setQuery] = React.useState(DEFAULT_QUERY);
  const { data: querySQLResult } = useQuery(query);

  const handleExecute = () => {
    const inputElement = document.getElementById(
      "query-input"
    ) as HTMLInputElement;
    if (inputElement && inputElement.value) {
      setQuery(inputElement.value);
    }
  };

  const columns = React.useMemo(() => {
    const firstItem = querySQLResult?.[0];
    return firstItem ? Object.keys(firstItem) : [];
  }, [querySQLResult]);

  console.log(query, querySQLResult);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">SQL Console</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          id="query-input"
          defaultValue={DEFAULT_QUERY}
          className="flex-grow"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleExecute();
            }
          }}
        />
        <Button onClick={handleExecute}>Execute Query</Button>
      </div>
      {querySQLResult && (
        <div className="mt-10 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {querySQLResult.map((row, index) => (
                <TableRow key={row.id ?? index}>
                  {columns.map((column) => (
                    <TableCell key={column}>{row[column]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
