from typing import List
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.task import Task, TaskStatus, TaskPriority


class TaskService:
    @staticmethod
    def get_tasks_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Task]:
        return db.query(Task).filter(Task.owner_id == user_id).offset(skip).limit(limit).all()

    @staticmethod
    def get_task_by_id(db: Session, task_id: int, user_id: int) -> Task | None:
        return db.query(Task).filter(Task.id == task_id, Task.owner_id == user_id).first()

    @staticmethod
    def create_task(
        db: Session, 
        title: str, 
        description: str | None, 
        status: TaskStatus, 
        priority: TaskPriority,
        due_date: datetime | None,  # YENİ
        user_id: int
    ) -> Task:
        db_task = Task(
            title=title,
            description=description,
            status=status.value,
            priority=priority.value,
            due_date=due_date,  # YENİ
            owner_id=user_id
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task

    @staticmethod
    def update_task(
        db: Session,
        task: Task,
        title: str | None = None,
        description: str | None = None,
        status: TaskStatus | None = None,
        priority: TaskPriority | None = None,
        due_date: datetime | None = None  # YENİ
    ) -> Task:
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if status is not None:
            task.status = status.value
        if priority is not None:
            task.priority = priority.value
        if due_date is not None:  # YENİ
            task.due_date = due_date
        
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def delete_task(db: Session, task: Task) -> None:
        db.delete(task)
        db.commit()