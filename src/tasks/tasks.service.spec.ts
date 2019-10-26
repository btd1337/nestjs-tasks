import { mockDeleteResult } from './../utils/test.utils';
import { Test, TestingModule } from '@nestjs/testing';

import { GetTasksFiltersDto } from '../dtos/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

import { NotFoundException } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { Task } from './task.entity';

const mockTaskRepository = () => ({
	getTasks: jest.fn(),
	findOne: jest.fn(),
	save: jest.fn(),
	delete: jest.fn(),
	createTask: jest.fn(),
});

const mockUser = new User();
mockUser.id = 1;

const mockTask = new Task(
	'Jogar Bola',
	'Futebol hoje a tarde',
	TaskStatus.IN_PROGRESS,
	mockUser.id,
	1,
);

describe('TasksService', () => {
	let tasksService: TasksService;
	let taskRepository: TaskRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TasksService,
				{
					provide: TaskRepository,
					useFactory: mockTaskRepository,
				},
			],
		}).compile();

		tasksService = module.get<TasksService>(TasksService);
		taskRepository = module.get<TaskRepository>(TaskRepository);
	});

	describe('getTasks', () => {
		it('gets all tasks from the repository', async () => {
			jest.spyOn(taskRepository, 'getTasks').mockResolvedValue([mockTask]);
			expect(taskRepository.getTasks).not.toHaveBeenCalled();
			const filters: GetTasksFiltersDto = {
				status: TaskStatus.IN_PROGRESS,
				search: 'Some search query',
			};
			// call tasksService.getTasks
			const result = await tasksService.getTasks(filters, mockUser);
			expect(taskRepository.getTasks).toHaveBeenCalled();
			expect(result).toEqual([mockTask]);
		});
	});

	describe('getTaskById', () => {
		it('calls taskRepository.findOne() and succesfully retrieve and return task', async () => {
			jest.spyOn(taskRepository, 'findOne').mockResolvedValue(mockTask);

			const result = await tasksService.getTaskById(mockTask.id, mockUser);
			expect(result).toEqual(mockTask);
			expect(taskRepository.findOne).toHaveBeenCalledWith({
				where: { id: mockTask.id, userId: mockUser.id },
			});
		});

		it('throws an error as task is not found', async () => {
			jest.spyOn(taskRepository, 'findOne').mockResolvedValue(undefined);
			await expect(tasksService.getTaskById(mockTask.id, mockUser)).rejects.toThrowError(
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
			jest.spyOn(taskRepository, 'createTask').mockResolvedValue(mockTask);
			expect(taskRepository.createTask).not.toHaveBeenCalled();
			const result = await tasksService.createTask(createTaskDto, mockUser);
			await expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
			expect(result).toEqual(mockTask);
		});
	});

	describe('updateTaskStatus', () => {
		it('should to update the task status', async () => {
			const mockTaskStatus = TaskStatus.DONE;
			const save = jest.fn().mockResolvedValue(true);
			tasksService.getTaskById = jest.fn().mockResolvedValue({
				status: TaskStatus.IN_PROGRESS,
				save,
			});
			expect(tasksService.getTaskById).not.toHaveBeenCalled();
			expect(save).not.toHaveBeenCalled();
			const result = await tasksService.updateTaskStatus(
				mockTask.id,
				mockUser,
				mockTaskStatus,
			);
			expect(tasksService.getTaskById).toHaveBeenCalled();
			expect(save).toHaveBeenCalled();
			expect(result.status).toEqual(mockTaskStatus);
		});
	});

	describe('deleteTaskById', () => {
		it('should calls taskRepository.delete() to delete a task', async () => {
			jest.spyOn(taskRepository, 'delete').mockResolvedValue(mockDeleteResult(1));
			expect(taskRepository.delete).not.toHaveBeenCalled();
			await tasksService.deleteTask(mockTask.id, mockUser);
			expect(taskRepository.delete).toHaveBeenCalledWith({
				id: mockTask.id,
				userId: mockUser.id,
			});
		});

		it('should throws an error as task could not be found', async () => {
			jest.spyOn(taskRepository, 'delete').mockResolvedValue(mockDeleteResult(0));
			await expect(tasksService.deleteTask(mockTask.id, mockUser)).rejects.toThrowError(
				NotFoundException,
			);
		});
	});
});
