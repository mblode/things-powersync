import { ListItem } from "@/components/todo/list-item";
import {
  type ListRecord,
  LISTS_TABLE,
  TODOS_TABLE,
} from "@/lib/powersync/app-schema";
import { usePowerSync, useQuery } from "@powersync/react";
import { useRouter } from "next/navigation";

export type Props = {
  selectedId?: string;
};

const description = (total: number, completed: number = 0) => {
  return `${total - completed} pending, ${completed} completed`;
};

export const TodoLists = (props: Props) => {
  const powerSync = usePowerSync();
  const router = useRouter();
  const { data: listRecords, isLoading } = useQuery<
    ListRecord & { total_tasks: number; completed_tasks: number }
  >(`
    SELECT
      ${LISTS_TABLE}.*, COUNT(${TODOS_TABLE}.id) AS total_tasks, SUM(CASE WHEN ${TODOS_TABLE}.completed = true THEN 1 ELSE 0 END) as completed_tasks
    FROM
      ${LISTS_TABLE}
    LEFT JOIN ${TODOS_TABLE}
      ON  ${LISTS_TABLE}.id = ${TODOS_TABLE}.list_id
    GROUP BY
      ${LISTS_TABLE}.id;
  `);

  const deleteList = async (id: string) => {
    await powerSync.writeTransaction(async (tx) => {
      // Delete associated todos
      await tx.execute(`DELETE FROM ${TODOS_TABLE} WHERE list_id = ?`, [id]);
      // Delete list record
      await tx.execute(`DELETE FROM ${LISTS_TABLE} WHERE id = ?`, [id]);
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  return (
    <div className="space-y-2">
      {listRecords.map((r) => (
        <ListItem
          key={r.id}
          title={r.name ?? ""}
          description={description(r.total_tasks, r.completed_tasks)}
          selected={r.id == props.selectedId}
          onDelete={() => deleteList(r.id)}
          onPress={() => {
            router.push(`/todo-lists/${r.id}`);
          }}
        />
      ))}
    </div>
  );
};
