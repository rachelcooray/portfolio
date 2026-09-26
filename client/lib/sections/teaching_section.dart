import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/section_container.dart';
import '../services/api_service.dart';
import '../theme/palette.dart';

class TeachingSection extends StatefulWidget {
  const TeachingSection({super.key});

  @override
  State<TeachingSection> createState() => _TeachingSectionState();
}

class _TeachingSectionState extends State<TeachingSection> {
  @override
  Widget build(BuildContext context) {
    return SectionContainer(
      title: 'Teaching & Mentoring',
      subtitle: 'Why I Teach',
      backgroundColor: AppColors.surface,
      child: FutureBuilder<List<dynamic>>(
        future: ApiService().getTeachingExperience(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: AppColors.accent));
          }
          final roles = snapshot.data ?? [];
          if (roles.isEmpty) return const SizedBox.shrink();

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 720),
                child: const Text(
                  "The clearest way I know an idea is understood is being able to teach it. Whether that's adapting a lesson for a classroom of primary learners or walking a university student through a concept they missed in a lecture, teaching has shaped how I explain technical work now — I default to making the reasoning behind a result legible, not just the result itself.",
                  style: TextStyle(fontSize: 16.5, height: 1.6, color: AppColors.textMuted),
                ),
              ).animate().fadeIn(delay: 200.ms, duration: 500.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic),
              const SizedBox(height: 36),
              ...roles.asMap().entries.map((entry) {
                final index = entry.key;
                final e = entry.value;
                return _TeachingTile(
                  title: e['title'],
                  org: e['company'],
                  date: e['date_range'],
                  summary: e['summary'],
                  details: List<String>.from(e['details'] ?? []),
                ).animate().fadeIn(delay: (350 + (index * 120)).ms, duration: 500.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic);
              }),
            ],
          );
        },
      ),
    );
  }
}

class _TeachingTile extends StatelessWidget {
  final String title;
  final String org;
  final String date;
  final String summary;
  final List<String> details;

  const _TeachingTile({
    required this.title,
    required this.org,
    required this.date,
    required this.summary,
    this.details = const [],
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surfaceAlt,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text)),
              ),
              Text(date, style: const TextStyle(fontSize: 13, color: AppColors.textFaint)),
            ],
          ),
          const SizedBox(height: 5),
          Text(org, style: const TextStyle(fontSize: 14.5, color: AppColors.accent, fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Text(summary, style: const TextStyle(fontSize: 13.5, color: AppColors.textMuted)),
          if (details.isNotEmpty) ...[
            const SizedBox(height: 14),
            ...details.map((d) => Padding(
                  padding: const EdgeInsets.only(bottom: 7),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('▹ ', style: TextStyle(color: AppColors.accent, fontSize: 14)),
                      Expanded(child: Text(d.replaceAll('**', ''), style: const TextStyle(color: AppColors.textMuted, fontSize: 14, height: 1.45))),
                    ],
                  ),
                )),
          ],
        ],
      ),
    );
  }
}
