"use client";
import React, { useState } from "react";
import {
  SortableList,
  SortableDragTrigger,
  SortableItem,
} from "~/components/sortable";
import { GripVertical } from "lucide-react";
import { cn } from "~/lib/utils";

function createRange<T>(
  length: number,
  initializer: (index: number) => T,
): T[] {
  return Array(length)
    .fill(0)
    .map((_, index) => initializer(index));
}

function getMockItems() {
  return createRange(50, (index) => ({ _id: index + 1 }));
}

export function DndDemo() {
  const [items, setItems] = useState(getMockItems);
  return (
    <div style={{ maxWidth: 400, margin: "30px auto" }}>
      <SortableList
        items={items}
        idKey="_id"
        onSortChange={(newData, form, to) => {
          setItems(newData);
        }}
        className={cn("flex flex-col gap-3")}
      >
        {(item) => (
          <SortableItem
            id={item._id}
            className={cn(
              "bg-background flex items-center justify-between px-5 py-4 shadow",
            )}
          >
            {item._id}

            <SortableDragTrigger size={"icon"}>
              <GripVertical />
            </SortableDragTrigger>
          </SortableItem>
        )}
      </SortableList>
    </div>
  );
}
