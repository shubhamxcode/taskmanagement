import React from 'react';
import { Trash2, CheckCircle, Clock } from 'lucide-react';

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: string;
    createdAt: string;
}

interface TaskCardProps {
    task: Task;
    onDelete: (id: number) => void;
    onUpdateStatus: (id: number, status: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onUpdateStatus }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'in-progress': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <div className="card group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    {task.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)} font-medium capitalize`}>
                    {task.status.replace('-', ' ')}
                </span>
            </div>

            {task.description && (
                <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                    {task.status !== 'completed' ? (
                        <button
                            onClick={() => onUpdateStatus(task.id, 'completed')}
                            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                            title="Mark as completed"
                        >
                            <CheckCircle size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={() => onUpdateStatus(task.id, 'todo')}
                            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all"
                            title="Reopen task"
                        >
                            <Clock size={18} />
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                        title="Delete task"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
                <span className="text-[10px] text-slate-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};

export default TaskCard;
