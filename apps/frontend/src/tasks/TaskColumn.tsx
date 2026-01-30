import { TaskCard } from './TaskCard';

export function TaskColumn({ title, tasks }: any) {
    return (
        <div style={{ width: 300 }}>
            <h3>{title}</h3>
            {tasks.map((t: any) => (
                <TaskCard key={t.id} task={t} />
            ))}
        </div>
    );
}
