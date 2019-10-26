import { TaskStatus } from '../tasks/task-status.enum';
import { strict } from 'assert';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTasksFiltersDto {
	@IsOptional()
	@IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
	status: TaskStatus;
	@IsOptional()
	@IsNotEmpty()
	search: string;
}
