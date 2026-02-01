import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    Card,
    CardContent,
    Pagination,
    Chip,
    TextField, MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useApiGetHandler} from "@app/api/useApiGetHandler.tsx";
import {getTasks} from "@app/api/tasks.api.ts";
import type {Task} from '@tms/shared-types/src/generated/types.gen.ts';
import {useCallback, useState} from "react";
import TaskCreateButton from "@app/components/TaskCreateButton/TaskCreateButton.tsx";
import TaskModal from "@app/components/TaskModal/TaskModal.tsx";

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | ''

export default function TasksPage() {
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<Priority>('');
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const fetchTasks = useCallback(() => getTasks({
        search: search || undefined,
        priority: priorityFilter || undefined,
        limit,
        page,
    }), [limit, page, priorityFilter, search]);

    const [data, isFetching, update] = useApiGetHandler(fetchTasks)

    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);

    const statuses = data?.items.reduce((acc, value) => {
        if (value?.status && !acc.includes(value.status)) {
            acc.push(value.status)
        }

        return acc
    }, [] as string[])

    const tasksByPriority = statuses?.reduce<Record<string, Task[]>>(
        (acc, status) => {
            acc[status] = data?.items?.filter(t => t.status === status) ?? [];
            return acc;
        },
        {LOW: [], MEDIUM: [], HIGH: []}
    );

    const isEmpty = data?.items?.length === 0;

    const didCloseTaskModal = useCallback(() => {
        setIsCreateTaskModalOpen(false)
    }, [])

    const didTaskCreatModalOpened = useCallback(() => {
        setCurrentTask(null);
        setIsCreateTaskModalOpen(true);
    }, [])

    const didTaskChangeModalOpened = useCallback((task: Task) => {
        setCurrentTask(task);
        setIsCreateTaskModalOpen(true);
    }, [])

    const didTaskCreated = useCallback(async () => {
        void update()
    }, [update])

    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
        >
            <Box
                px={4}
                py={3}
                display="flex"
                flex="1"
                flexDirection="column"
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={3}
                    gap={2}
                >
                    <Typography variant="h5" fontWeight={600}>
                        Tasks
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            size="small"
                            placeholder="Search…"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />

                        <TextField
                            select
                            size="small"
                            label="Priority"
                            value={priorityFilter}
                            onChange={(e) => {
                                setPriorityFilter(e.target.value as Priority);
                                setPage(1);
                            }}
                            sx={{ minWidth: 130 }}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                        </TextField>

                        <TextField
                            select
                            size="small"
                            label="Per page"
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                            sx={{ minWidth: 110 }}
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                        </TextField>

                        <TaskCreateButton onClick={didTaskCreatModalOpened} />
                    </Stack>
                </Box>

                {isFetching && (
                    <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                    >
                        <Typography variant="h6" gutterBottom>
                            Loading...
                        </Typography>
                    </Box>
                )}
                {isEmpty && !isFetching && (
                    <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                    >
                        <Typography variant="h6" gutterBottom>
                            Tasks not found
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={3}
                        >
                            Create your first task to get started
                        </Typography>
                        <TaskCreateButton onClick={didTaskCreatModalOpened}/>
                    </Box>
                )}

                {!isEmpty && !isFetching && (
                    <>
                        <Box flex={1} overflow="auto">
                            {statuses?.map(status => (
                                <Accordion
                                    key={status}
                                    defaultExpanded
                                    sx={{mb: 2}}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                        >
                                            <Typography fontWeight={500}>
                                                {status}
                                            </Typography>
                                            <Chip
                                                size="small"
                                                label={tasksByPriority?.[status].length}
                                            />
                                        </Stack>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <Stack spacing={2}>
                                            {tasksByPriority?.[status].map(task => (
                                                <Card
                                                    key={task.id}
                                                    variant="outlined"
                                                    onClick={() => didTaskChangeModalOpened(task)}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        transition: '0.2s',
                                                        '&:hover': {
                                                            bgcolor: 'action.hover',
                                                        },
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Typography fontWeight={500}>
                                                            {task.title}
                                                        </Typography>

                                                        {task.description && (
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                mt={0.5}
                                                            >
                                                                {task.description}
                                                            </Typography>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                        <Box
                            mt={2}
                            display="flex"
                            justifyContent="center"
                        >
                            <Pagination
                                count={Math.ceil((data?.total ?? 0) / limit)}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                            />
                        </Box>
                    </>
                )}
            </Box>
            <TaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={didCloseTaskModal}
                onSuccess={didTaskCreated}
                task={currentTask}
            />
        </Box>
    );
}
