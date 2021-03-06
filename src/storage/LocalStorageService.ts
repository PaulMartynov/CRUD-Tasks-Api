import { getTasksByFilter } from "./utils/filter";

export class LocalStorageService implements StorageService {
  addNewTask = async (taskData: TaskData): Promise<number | null> => {
    const tasks: Task[] = await this.getAllTasks();
    const lastId = tasks[tasks.length - 1] ? tasks[tasks.length - 1].id : 0;
    const id = lastId + 1;
    tasks.push({ id, ...taskData });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return id;
  };

  deleteTask = async (id: number): Promise<boolean> => {
    const tasks: Task[] = await this.getAllTasks();
    const newTasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    return true;
  };

  getAllTasks = async (): Promise<Task[]> => {
    const result = localStorage.getItem("tasks");
    const tasks = JSON.parse(result ?? "[]");
    tasks.forEach((task: Task) => {
      task.date = new Date(task.date);
    });
    tasks.sort((a: Task, b: Task) => {
      return a.id - b.id;
    });
    return tasks;
  };

  getTask = async (id: number): Promise<Task | null> => {
    const tasks: Task[] = await this.getAllTasks();
    const task = tasks.find((item) => item.id === id);
    if (!task) {
      return null;
    }
    return task;
  };

  updateTask = async (id: number, payload: Partial<Task>): Promise<boolean> => {
    const tasks: Task[] = await this.getAllTasks();
    let task = tasks.find((item) => item.id === id);
    if (!task) {
      return false;
    }
    task = { ...task, ...payload };
    const newTasks = tasks.filter((item) => item.id !== id);
    newTasks.push(task);
    await localStorage.setItem("tasks", JSON.stringify(newTasks));
    return true;
  };

  findTasks = async (filter: Filter): Promise<Task[]> => {
    const tasks = await this.getAllTasks();
    return getTasksByFilter(tasks, filter);
  };
}
