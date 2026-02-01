import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface TaskFormProps {
    onAdd: (title: string, description: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd(title, description);
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="card mb-8">
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-1">
                        Task Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder="What needs to be done?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-field w-full"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-1">
                        Description (Optional)
                    </label>
                    <textarea
                        id="description"
                        placeholder="Add some details..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-field w-full min-h-[100px] resize-none"
                    />
                </div>
                <button type="submit" className="btn-primary w-full sm:w-auto px-8">
                    <PlusCircle size={18} />
                    Add Task
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
