import { Test } from '@nestjs/testing';

import { GetTasksFiltersDto } from '../DTO/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
	getTasks: jest.fn(),
	findOne: jest.fn(),
	save: jest.fn(),
});

describe('TasksService', () => {
	let tasksService;
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
			const result = await tasksService.getTasks(filters);
			expect(taskRepository.getTasks).toHaveBeenCalled();
			expect(result).toEqual('someValue');
		});
	});

	describe('getTaskById', () => {
		it('calls taskRepository.findOne() and succesfully retrieve and return task', async () => {
			const mockTask = { title: 'Test task', description: 'Test desc' };
			const mockId = 1;
			taskRepository.findOne.mockResolvedValue(mockTask);

			const result = await tasksService.getTaskById(1);
			expect(result).toEqual(mockTask);
			expect(taskRepository.findOne).toHaveBeenCalledWith(mockId);
		});

		it('throws an error as task is not found', async () => {
			taskRepository.findOne.mockResolvedValue(null);
			expect(tasksService.getTaskById(1)).rejects.toThrow(NotFoundException);
		});
	});

	describe('create task', () => {
		it('calls taskRepository.save() and returns the result', async () => {
			const createTaskDto = {
				title: 'Test task',
				description: 'Test desc',
			};
			const task = {
				title: 'Test task',
				description: 'Test desc',
				status: 'IN_PROGRESS',
			};
			taskRepository.save.mockResolvedValue('someValue');
			expect(taskRepository.save).not.toHaveBeenCalled();
			const result = await tasksService.createTask(createTaskDto);
			expect(taskRepository.save).toHaveBeenCalledWith(task);
			expect(result).toEqual('someValue');
		});
	});
});
