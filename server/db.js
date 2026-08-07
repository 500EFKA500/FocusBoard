import Database from 'better-sqlite3'
import { randomUUID } from 'node:crypto'
import seedTasks from './data/seedTasks.js'

export function createTaskRepository({ filename = ':memory:', initialTasks = seedTasks } = {}) {
  const database = new Database(filename)

  database.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL,
      priority TEXT NOT NULL
    )
  `)

  const existingTaskCount = database.prepare('SELECT COUNT(*) AS count FROM tasks').get().count

  if (existingTaskCount === 0) {
    const insertSeedTask = database.prepare(`
      INSERT INTO tasks (id, title, description, status, priority)
      VALUES (@id, @title, @description, @status, @priority)
    `)

    database.transaction((tasks) => {
      for (const task of tasks) {
        insertSeedTask.run(task)
      }
    })(initialTasks)
  }

  const findAll = database.prepare('SELECT * FROM tasks ORDER BY rowid DESC')
  const findById = database.prepare('SELECT * FROM tasks WHERE id = ?')
  const insertTask = database.prepare(`
    INSERT INTO tasks (id, title, description, status, priority)
    VALUES (@id, @title, @description, @status, @priority)
  `)
  const updateTask = database.prepare(`
    UPDATE tasks
    SET title = @title, description = @description, status = @status, priority = @priority
    WHERE id = @id
  `)
  const deleteTask = database.prepare('DELETE FROM tasks WHERE id = ?')

  return {
    findAll: () => findAll.all(),
    findById: (id) => findById.get(id),
    create: (task) => {
      const newTask = { id: randomUUID(), ...task }
      insertTask.run(newTask)
      return newTask
    },
    update: (task) => {
      updateTask.run(task)
      return findById.get(task.id)
    },
    delete: (id) => deleteTask.run(id).changes > 0,
    close: () => database.close(),
  }
}