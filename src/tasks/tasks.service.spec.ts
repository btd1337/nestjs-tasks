import { Test } from '@nestjs/testing';

import { GetTasksFiltersDto } from '../DTO/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

import { NotFoundException } from '@nestjs/common';
import { User } from '../auth/user.entity';

const mockTaskRepository = () => ({
	getTasks: jest.fn(),
	findOne: jest.fn(),
	save: jest.fn(),
	delete: jest.fn(),
	createTask: jest.fn(),
});

const mockUser = new User();
mockUser.id = 1;

const mockTaskId = 1;

describe('TasksService', () => {
	let tasksService: TasksService;
	let taskRepository;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				TasksService,
				{
					provide: TaskRepository,
					useFactory: mockTaskRepository,
				},
			],
		}).compile();

		tasksService = await module.get<TasksService>(TasksService);
		taskRepository = await module.get<TaskRepository>(TaskRepository);
	});

	describe('getTasks', () => {
		it('gets all tasks from the repository', async () => {
			taskRepository.getTasks.mockResolvedValue('someValue');
			expect(taskRepository.getTasks).not.toHaveBeenCalled();
			const filters: GetTasksFiltersDto = {
				status: TaskStatus.IN_PROGRESS,
				search: 'Some search query',
			};
			// call tasksService.getTasks
			const result = await tasksService.getTasks(filters, mockUser);
			expect(taskRepository.getTasks).toHaveBeenCalled();
			expect(result).toEqual('someValue');
		});
	});

	describe('getTaskById', () => {
		it('calls taskRepository.findOne() and succesfully retrieve and return task', async () => {
			const mockTask = { title: 'Test task', description: 'Test desc' };
			taskRepository.findOne.mockResolvedValue(mockTask);

			const result = await tasksService.getTaskById(mockTaskId, mockUser);
			expect(result).toEqual(mockTask);
			expect(taskRepository.findOne).toHaveBeenCalledWith({
				where: { id: mockTaskId, userId: mockUser.id },
			});
		});

		it('throws an error as task is not found', async () => {
			taskRepository.findOne.mockResolvedValue(undefined);
			await expect(tasksService.getTaskById(mockTaskId, mockUser)).rejects.toThrowError(
				NotFoundException,
			);
		});
	});

	describe('create task', () => {
		it('calls taskRepository.createTask() and returns the result', async () => {
			const createTaskDto = {
				title: 'Test task',
				description: 'Test desc',
			};
			const task = {
				title: 'Test task',
				description: 'Test desc',
				status: 'IN_PROGRESS',
			};
			taskRepository.createTask.mockResolvedValue(task);
			expect(taskRepository.createTask).not.toHaveBeenCalled();
			const result = await tasksService.createTask(createTaskDto, mockUser);
			await expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
			expect(result).toEqual(task);
		});
	});

	describe('deleteTaskById', () => {
		it('should calls taskRepository.delete() to delete a task', async () => {
			taskRepository.delete.mockResolvedValue({ affected: 1 });
			expect(taskRepository.delete).not.toHaveBeenCalled();
			await tasksService.deleteTask(mockTaskId, mockUser);
			expect(taskRepository.delete).toHaveBeenCalledWith({
				id: mockTaskId,
				userId: mockUser.id,
			});
		});

		it('should throws an error as task could not be found', async () => {
			taskRepository.delete.mockResolvedValue({ affected: 0 });
			await expect(tasksService.deleteTask(mockTaskId, mockUser)).rejects.toThrowError(
				NotFoundException,
			);
		});
	});
});
