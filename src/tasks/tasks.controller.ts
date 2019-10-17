import { User } from './../auth/user.entity';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateTaskDto } from '../DTO/create-task.DTO';
import { GetTasksFiltersDto } from '../DTO/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/tasks-status-validation-pipes';
import { TaskStatus } from './task-status.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
	constructor(private readonly tasksServices: TasksService) {}

	@Post()
	@UsePipes(ValidationPipe)
	createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
		return this.tasksServices.createTask(createTaskDto, user);
	}
	@Get('/:id')
	getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
		return this.tasksServices.getTaskById(id, user);
	}
	@Delete('/:id')
	deleteTask(@Param('id', ParseIntPipe) id: number, user: User): Promise<void> {
		return this.tasksServices.deleteTask(id, user);
	}

	@Patch('/:id/status')
	updateTaskStatus(
		@Param('id', ParseIntPipe) id: number,
		@Body('status', new TaskStatusValidationPipe()) status: TaskStatus,
		@GetUser() user: User,
	): Promise<Task> {
		return this.tasksServices.updateTaskStatus(id, user, status);
	}

	@Get()
	getTasks(
		@Query(ValidationPipe) filtersDto: GetTasksFiltersDto,
		@GetUser() user: User,
	): Promise<Task[]> {
		return this.tasksServices.getTasks(filtersDto, user);
	}
}
