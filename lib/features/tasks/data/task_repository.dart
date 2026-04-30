import 'package:isar/isar.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../domain/task.dart';

part 'task_repository.g.dart';

class TaskRepository {
  final Isar isar;

  TaskRepository(this.isar);

  Future<List<Task>> getAllTasks() async {
    return await isar.tasks.where().sortByDeadline().findAll();
  }

  Future<void> saveTask(Task task) async {
    await isar.writeTxn(() async {
      await isar.tasks.put(task);
    });
  }

  Future<void> deleteTask(Id id) async {
    await isar.writeTxn(() async {
      await isar.tasks.delete(id);
    });
  }

  Future<void> toggleTaskCompletion(Id id) async {
    await isar.writeTxn(() async {
      final task = await isar.tasks.get(id);
      if (task != null) {
        task.isCompleted = !task.isCompleted;
        await isar.tasks.put(task);
      }
    });
  }

  Stream<List<Task>> watchTasks() {
    return isar.tasks.where().sortByDeadline().watch(fireImmediately: true);
  }
}

@Riverpod(keepAlive: true)
TaskRepository taskRepository(TaskRepositoryRef ref) {
  throw UnimplementedError('Isar must be initialized and repository injected');
}
