import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest.dart' as tz;
import 'package:timezone/timezone.dart' as tz;
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'notification_service.g.dart';

class NotificationService {
  final FlutterLocalNotificationsPlugin _notifications = FlutterLocalNotificationsPlugin();

  Future<void> init() async {
    tz.initializeTimeZones();

    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings iosSettings =
        DarwinInitializationSettings();

    const InitializationSettings settings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _notifications.initialize(settings);
  }

  Future<void> scheduleDeadlineReminders({
    required int id,
    required String title,
    required DateTime deadline,
  }) async {
    final now = DateTime.now();

    // 24 hours before
    final reminder24h = deadline.subtract(const Duration(hours: 24));
    if (reminder24h.isAfter(now)) {
      await _schedule(
        id: id * 2,
        title: 'Upcoming Deadline: $title',
        body: 'Your task is due in 24 hours.',
        scheduledDate: reminder24h,
      );
    }

    // 1 hour before
    final reminder1h = deadline.subtract(const Duration(hours: 1));
    if (reminder1h.isAfter(now)) {
      await _schedule(
        id: id * 2 + 1,
        title: 'Deadline Approaching: $title',
        body: 'Your task is due in 1 hour.',
        scheduledDate: reminder1h,
      );
    }
  }

  Future<void> cancelReminders(int id) async {
    await _notifications.cancel(id * 2);
    await _notifications.cancel(id * 2 + 1);
  }

  Future<void> _schedule({
    required int id,
    required String title,
    required String body,
    required DateTime scheduledDate,
  }) async {
    await _notifications.zonedSchedule(
      id,
      title,
      body,
      tz.TZDateTime.from(scheduledDate, tz.local),
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'deadline_reminders',
          'Deadline Reminders',
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: DarwinNotificationDetails(),
      ),
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
    );
  }
}

@Riverpod(keepAlive: true)
NotificationService notificationService(NotificationServiceRef ref) {
  return NotificationService();
}
