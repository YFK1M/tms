export function TaskCard({ task }: any) {
    return (
        <div style={{ border: '1px solid #ccc', marginBottom: 8, padding: 8 }}>
            <strong>{task.title}</strong>
            <div>Priority: {task.priority}</div>
            <div>Author: {task.userId}</div>
        </div>
    );
}
