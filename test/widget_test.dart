import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:tasksbhulejai/main.dart';

void main() {
  testWidgets('App loads smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    // Note: This test will fail if it tries to initialize Isar in the test environment
    // without proper mocking. For a smoke test, we just check if MainApp can be pumped.
    await tester.pumpWidget(const ProviderScope(child: MainApp()));

    // Since main() initializes Isar before runApp, this test might need more setup.
    // For now, we've fixed the compilation error.
  });
}
