import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/section_container.dart';
import '../services/api_service.dart';
import '../theme/palette.dart';

class SkillsSection extends StatelessWidget {
  const SkillsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return SectionContainer(
      title: 'Skills',
      subtitle: 'What I Can Do',
      backgroundColor: AppColors.surface,
      child: FutureBuilder<List<dynamic>>(
        future: ApiService().getSkills(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: AppColors.accent));
          }
          if (snapshot.hasError) {
             return const Text("Failed to load skills", style: TextStyle(color: Colors.red));
          }

          final categories = snapshot.data ?? [];
          int globalSkillIndex = 0;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: categories.map((category) {
              final catTitle = category['category'];
              final items = List<String>.from(category['items']);

              return Padding(
                padding: const EdgeInsets.only(bottom: 30.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(catTitle, style: const TextStyle(color: AppColors.text, fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 15),
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      children: items.map((skill) {
                        final chip = _SkillChip(label: skill)
                            .animate()
                            .fadeIn(delay: (400 + (globalSkillIndex * 50)).ms, duration: 450.ms, curve: Curves.easeInOutCubic)
                            .slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic);
                        globalSkillIndex++;
                        return chip;
                      }).toList(),
                    ),
                  ],
                ),
              );
            }).toList(),
          );
        },
      ),
    );
  }
}

class _SkillChip extends StatefulWidget {
  final String label;
  const _SkillChip({required this.label});

  @override
  State<_SkillChip> createState() => _SkillChipState();
}

class _SkillChipState extends State<_SkillChip> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeInOutCubic,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: AppColors.surfaceAlt,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
             color: _isHovered ? AppColors.accent : AppColors.divider,
             width: 1.5
          ),
        ),
        child: Text(
          widget.label,
          style: TextStyle(
            color: _isHovered ? AppColors.accent : AppColors.textMuted,
            fontWeight: _isHovered ? FontWeight.bold : FontWeight.normal
          ),
        ),
      ),
    );
  }
}
