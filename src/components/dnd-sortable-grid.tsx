"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  type UniqueIdentifier,
  type DropAnimation,
  defaultDropAnimationSideEffects,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { GripVertical, X } from "lucide-react";

const defaultInitializer = (index: number) => index;

function createRange(
  length: number,
  initializer: (index: number) => number = defaultInitializer,
) {
  return Array(length)
    .fill(0)
    .map((_, index) => initializer(index));
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export function DndSortableGridDemo() {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const [items, setItems] = React.useState<UniqueIdentifier[]>(() =>
    createRange(16, (index) => index),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor, {
      /** for mobile Khi nhấn giữ */
      // activationConstraint: {
      //   delay: 250,
      //   tolerance: 5,
      // },
    }),
    /** Giống mouse */
    useSensor(TouchSensor, {
      /** for mobile Khi nhấn giữ */
      // activationConstraint: {
      //   delay: 250,
      //   tolerance: 5,
      // },
    }),
    useSensor(KeyboardSensor, {
      // Disable smooth scrolling in Cypress automated tests
      scrollBehavior:
        typeof window !== "undefined"
          ? "Cypress" in window
            ? "auto"
            : undefined
          : undefined,
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeIndex = activeId !== null ? getIndex(activeId) : -1;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-4 gap-4">
          {items.map((id) => (
            <SortableItem key={id} id={id} onDelete={() => handleRemove(id)} />
          ))}
        </div>
      </SortableContext>

      {typeof window !== "undefined"
        ? createPortal(
            <DragOverlay adjustScale dropAnimation={dropAnimationConfig}>
              {activeId ? (
                <Item id={activeId} isDragOverlay className="shadow-lg" />
              ) : null}
            </DragOverlay>,
            window.document.body,
          )
        : null}
    </DndContext>
  );

  function handleRemove(id: UniqueIdentifier) {
    setItems((items) => items.filter((item) => item !== id));
  }

  function handleDragStart({ active }: DragStartEvent) {
    if (!active) {
      return;
    }

    setActiveId(active.id);
  }

  function getIndex(id: UniqueIdentifier) {
    return items.indexOf(id);
  }

  function handleDragEnd({ over }: DragEndEvent) {
    // const { active, over } = event;

    // if (active.id !== over?.id) {
    //   setItems((items) => {
    //     const oldIndex = items.indexOf(active.id as number);
    //     const newIndex = items.indexOf(over?.id as number);

    //     return arrayMove(items, oldIndex, newIndex);
    //   });
    // }
    setActiveId(null);

    if (over) {
      const overIndex = getIndex(over.id);

      if (activeIndex !== overIndex) {
        setItems((items) => arrayMove(items, activeIndex, overIndex));
      }
    }
  }

  function handleDragCancel() {
    setActiveId(null);
  }
}

function SortableItem(props: React.ComponentProps<typeof Item>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
    isDragging,
  } = useSortable({ id: props.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  };

  return (
    <Item
      suppressHydrationWarning
      ref={setNodeRef}
      triggerProps={{
        ref: setActivatorNodeRef,
        ...listeners,
      }}
      style={style}
      {...attributes}
      {...props}
    />
  );
}

const Item = ({
  id,
  className,
  onDelete,
  triggerProps,
  isDragOverlay,
  ...props
}: Omit<React.ComponentProps<"div">, "id"> & {
  id: UniqueIdentifier;
  onDelete?: () => void;
  triggerProps?: React.ComponentProps<typeof Button>;
  isDragOverlay?: boolean;
}) => {
  return (
    <div
      className={cn("bg-card flex justify-between border p-2", className)}
      data-id={id}
      {...props}
    >
      {id}
      <div className="flex gap-3">
        <Button variant={"ghost"} size={"icon"} onClick={onDelete}>
          <X />
        </Button>

        <Button
          variant={"ghost"}
          size={"icon"}
          className={cn(isDragOverlay ? "cursor-grabbing" : "cursor-move")}
          {...triggerProps}
        >
          <GripVertical />
        </Button>
      </div>
    </div>
  );
};
