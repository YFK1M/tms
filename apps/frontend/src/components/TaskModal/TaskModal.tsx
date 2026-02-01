import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    MenuItem,
} from '@mui/material';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {deleteTaskById, postTaskCreate, putTaskUpdateById} from "@app/api/tasks.api.ts";
import type {Task} from '@tms/shared-types/src/generated/types.gen.ts';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface TaskModalProps {
    isOpen: boolean;
    task?: Task | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TaskModal({
    isOpen,
    task,
    onClose,
    onSuccess,
}: TaskModalProps) {
    const isEditMode = Boolean(task);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('MEDIUM');
    const [status, setStatus] = useState<Status>('TODO');
    const [dueDate, setDueDate] = useState('');

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const resetForm = useCallback(() => {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
        setStatus('TODO');
        setDueDate('');
    }, []);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [onClose, resetForm]);

    const handleSubmit = useCallback(async () => {
        const isoDueDate = dueDate
            ? new Date(dueDate).toISOString()
            : undefined;

        const data = {
            title,
            description,
            priority,
            status,
            dueDate: isoDueDate,
        }

        if (isEditMode && task?.id) {
            await putTaskUpdateById(task.id, data);
        } else {
            await postTaskCreate(data);
        }

        onSuccess();
        handleClose();
    }, [dueDate, title, description, priority, status, isEditMode, task?.id, onSuccess, handleClose]);

    const handleDeleteClick = useCallback(() => {
        setIsConfirmOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!task?.id) return;

        await deleteTaskById(task.id);

        setIsConfirmOpen(false);
        onSuccess();
        handleClose();
    }, [task?.id, onSuccess, handleClose]);

    const titleText = useMemo(() =>
        isEditMode ? 'Edit task' : 'Create task'
    , [isEditMode]);

    const actionText = useMemo(() =>
        isEditMode ? 'Save changes' : 'Create'
    , [isEditMode]);

    /**
     * Инициализация формы
     */
    useEffect(() => {
        if (!isOpen) return;

        if (!task) {
            resetForm();
            return;
        }

        setTitle(task.title ?? '')
        setDescription(task.description ?? '');
        setPriority(task.priority ?? 'MEDIUM');
        setStatus(task.status ?? 'TODO');
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
    }, [task, isOpen, resetForm]);

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{titleText}</DialogTitle>

                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Title"
                            fullWidth
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            minRows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <TextField
                            select
                            label="Priority"
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value as Priority)
                            }
                        >
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Status"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value as Status)
                            }
                        >
                            <MenuItem value="TODO">Todo</MenuItem>
                            <MenuItem value="IN_PROGRESS">In progress</MenuItem>
                            <MenuItem value="DONE">Done</MenuItem>
                        </TextField>

                        <TextField
                            label="Due date"
                            type="datetime-local"
                            InputLabelProps={{shrink: true}}
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{px: 3, pb: 2}}>
                    {isEditMode && task?.id && (
                        <Button
                            color="error"
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </Button>
                    )}
                    <Stack direction="row" spacing={1} ml="auto">
                        <Button onClick={handleClose} color="inherit">
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={!title.trim()}
                        >
                            {actionText}
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
            <Dialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
            >
                <DialogTitle>Delete task?</DialogTitle>

                <DialogContent>
                    This action cannot be undone.
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setIsConfirmOpen(false)}
                        color="inherit"
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleConfirmDelete}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
