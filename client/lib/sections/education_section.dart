import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/section_container.dart';
import '../services/api_service.dart';
import '../theme/palette.dart';

class EducationSection extends StatefulWidget {
  const EducationSection({super.key});

  @override
  State<EducationSection> createState() => _EducationSectionState();
}

class _EducationSectionState extends State<EducationSection> {
  @override
  Widget build(BuildContext context) {
    return SectionContainer(
      title: 'Education',
      subtitle: 'Where I Studied',
      backgroundColor: AppColors.surface,
      child: FutureBuilder<List<dynamic>>(
        future: ApiService().getExperience(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: AppColors.accent));
          }
          if (snapshot.hasError) {
            return const Text("Failed to load education", style: TextStyle(color: Colors.red));
          }

          final education = (snapshot.data ?? [])
              .where((e) => e['type'] == 'education')
              .toList();

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: education.asMap().entries.map((entry) {
              final index = entry.key;
              final e = entry.value;
              return _EducationTile(
                title: e['title'],
                institution: e['company'],
                date: e['date_range'],
                summary: e['summary'],
                details: List<String>.from(e['details'] ?? []),
              ).animate().fadeIn(delay: (300 + (index * 100)).ms, duration: 600.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic);
            }).toList(),
          );
        },
      ),
    );
  }
}

class _EducationTile extends StatelessWidget {
  final String title;
  final String institution;
  final String date;
  final String summary;
  final List<String> details;

  const _EducationTile({
    required this.title,
    required this.institution,
    required this.date,
    required this.summary,
    this.details = const [],
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(25),
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
                child: Text(title, style: const TextStyle(fontSize: 19, fontWeight: FontWeight.bold, color: AppColors.text)),
              ),
              Text(date, style: const TextStyle(fontSize: 13, color: AppColors.textFaint, fontFamily: 'Fira Code')),
            ],
          ),
          const SizedBox(height: 6),
          Text(institution, style: const TextStyle(fontSize: 15, color: AppColors.accent, fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          Text(summary, style: const TextStyle(fontSize: 14, color: AppColors.textMuted)),
          if (details.isNotEmpty) ...[
            const SizedBox(height: 14),
            ...details.map((d) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("▹ ", style: TextStyle(color: AppColors.accent, fontSize: 14)),
                      Expanded(
                        child: Text(
                          d.replaceAll('**', ''),
                          style: const TextStyle(color: AppColors.textMuted, fontSize: 14, height: 1.4),
                        ),
                      ),
                    ],
                  ),
                )),
          ],
        ],
      ),
    );
  }
}
