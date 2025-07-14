import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm, TaskFormProps } from "./task-form";

interface TaskModalProps extends TaskFormProps {
  isOpen: boolean;
}

function TaskModal({
  isOpen,
  initialTask: editingTask,
  onSubmit: handleUpdateTask,
  onCancel: handleCancelForm,
}: TaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={handleCancelForm}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader className="hidden">
          <DialogTitle>Task Modal</DialogTitle>
        </DialogHeader>
        <TaskForm
          initialTask={editingTask || undefined}
          onSubmit={handleUpdateTask}
          onCancel={handleCancelForm}
        />
      </DialogContent>
    </Dialog>
  );
}

export default TaskModal;
