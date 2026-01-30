import { useEffect, useState } from 'react';
import { getTasks } from '../api/tasks.api';
import { TaskColumn } from './TaskColumn';

export function TasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate'>('createdAt');

    useEffect(() => {
        getTasks({ sortBy, order: 'desc' }).then(r => setTasks(r.items));
    }, [sortBy]);

    return (
        <>
            <select onChange={e => setSortBy(e.target.value as any)}>
                <option value="createdAt">Created</option>
                <option value="dueDate">Due date</option>
            </select>

            <div style={{ display: 'flex', gap: 16 }}>
                <TaskColumn title="TODO" tasks={tasks.filter(t => t.status === 'TODO')} />
                <TaskColumn title="IN_PROGRESS" tasks={tasks.filter(t => t.status === 'IN_PROGRESS')} />
                <TaskColumn title="DONE" tasks={tasks.filter(t => t.status === 'DONE')} />
            </div>
        </>
    );
}
