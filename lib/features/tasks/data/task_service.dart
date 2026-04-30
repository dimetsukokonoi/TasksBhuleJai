import 'package:isar/isar.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../domain/task.dart';
import 'task_repository.dart';
import '../../notifications/data/notification_service.dart';

part 'task_service.g.dart';

@riverpod
class TaskList extends _$TaskList {
  @override
  Stream<List<Task>> build() {
    final repository = ref.watch(taskRepositoryProvider);
    return repository.watchTasks();
  }

  Future<void> addTask({
    required String title,
    required String description,
    required DateTime deadline,
    required String category,
  }) async {
    final task = Task(
      title: title,
      description: description,
      deadline: deadline,
      category: category,
    );
    await ref.read(taskRepositoryProvider).saveTask(task);

    // Schedule notifications
    await ref.read(notificationServiceProvider).scheduleDeadlineReminders(
      id: task.id,
      title: task.title,
      deadline: task.deadline,
    );
  }

  Future<void> toggleTask(Id id) async {
    await ref.read(taskRepositoryProvider).toggleTaskCompletion(id);

    // Cancel notifications if completed
    final tasks = await future;
    final task = tasks.firstWhere((t) => t.id == id);
    if (task.isCompleted) {
      await ref.read(notificationServiceProvider).cancelReminders(id);
    } else {
      // Re-schedule if un-completed
      await ref.read(notificationServiceProvider).scheduleDeadlineReminders(
        id: task.id,
        title: task.title,
        deadline: task.deadline,
      );
    }
  }

  Future<void> removeTask(Id id) async {
    await ref.read(notificationServiceProvider).cancelReminders(id);
    await ref.read(taskRepositoryProvider).deleteTask(id);
  }
}
