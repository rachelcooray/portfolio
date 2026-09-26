import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../services/api_service.dart';
import '../widgets/section_container.dart';
import '../theme/palette.dart';

class AwardsSection extends StatefulWidget {
  const AwardsSection({super.key});

  @override
  State<AwardsSection> createState() => _AwardsSectionState();
}

class _AwardsSectionState extends State<AwardsSection> {
  final ApiService _apiService = ApiService();
  late Future<List<dynamic>> _awardsFuture;

  @override
  void initState() {
    super.initState();
    _awardsFuture = _apiService.getAwards();
  }

  @override
  Widget build(BuildContext context) {
    return SectionContainer(
      title: 'Achievements',
      subtitle: 'Awards & Recognition',
      backgroundColor: AppColors.surface,
      child: FutureBuilder<List<dynamic>>(
        future: _awardsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: AppColors.accent));
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No awards found.'));
          }

          final awards = snapshot.data!;
          return Column(
            children: awards.asMap().entries.map((entry) {
              final index = entry.key;
              final award = entry.value;
              return _AwardItem(award: award)
                  .animate()
                  .fadeIn(delay: (400 + (index * 100)).ms, duration: 450.ms, curve: Curves.easeInOutCubic)
                  .slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic);
            }).toList(),
          );
        },
      ),
    );
  }
}

class _AwardItem extends StatelessWidget {
  final dynamic award;

  const _AwardItem({required this.award});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Container(
        padding: const EdgeInsets.all(25),
        decoration: BoxDecoration(
          color: AppColors.surfaceAlt,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.divider),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.accent.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.emoji_events, color: AppColors.accent, size: 24),
            ),
            const SizedBox(width: 25),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: Text(
                          award['title'] ?? '',
                          style: GoogleFonts.figtree(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppColors.text,
                          ),
                        ),
                      ),
                      Text(
                        award['year'] ?? '',
                        style: const TextStyle(
                          color: AppColors.accent,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'Fira Code',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 5),
                  Text(
                    award['organization'] ?? '',
                    style: const TextStyle(
                      color: AppColors.accent,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    award['summary'] ?? '',
                    style: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 14,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
