import express from 'express';
import type { Request, Response } from 'express';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
// Get all tasks
app.get('/api/tasks', async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Create a task
app.post('/api/tasks', async (req: Request, res: Response) => {
    const { title, description, status } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    try {
        const task = await prisma.task.create({
            data: { title, description, status },
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update a task
app.put('/api/tasks/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const task = await prisma.task.update({
            where: { id: Number(id) },
            data: { title, description, status },
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.task.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
