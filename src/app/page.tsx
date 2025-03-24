import { DndSortableDemo } from "~/components/dnd-sortable";
import { DndSortableGridDemo } from "~/components/dnd-sortable-grid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="max-h-svh overflow-x-hidden overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <div>
            <DndSortableGridDemo />
            {/* <DndSortableDemo /> */}
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto">
        {/* <DndSortableDemo /> */}
        <DndSortableGridDemo />
      </div>
    </main>
  );
}
