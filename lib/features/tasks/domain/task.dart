import 'package:isar/isar.dart';

part 'task.g.dart';

@collection
class Task {
  Id id = Isar.autoIncrement;

  late String title;
  late String description;
  late DateTime deadline;

  // Category as a string for now, could be an enum later
  late String category;

  @Index()
  bool isCompleted = false;

  late DateTime createdAt;

  Task({
    required this.title,
    required this.description,
    required this.deadline,
    required this.category,
    this.isCompleted = false,
  }) : this.createdAt = DateTime.now();
}
