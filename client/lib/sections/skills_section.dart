import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/section_container.dart';
import '../services/api_service.dart';

class SkillsSection extends StatelessWidget {
  const SkillsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return SectionContainer(
      title: '03. What I Can Do',
      subtitle: 'Skills & Interests',
      child: FutureBuilder<List<dynamic>>(
        future: ApiService().getSkills(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
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
                    Row(
                       children: [
                         Icon(Icons.layers_outlined, color: Theme.of(context).primaryColor, size: 20),
                         const SizedBox(width: 10),
                         Text(catTitle, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                       ],
                    ),
                    const SizedBox(height: 15),
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      children: items.map((skill) {
                        final chip = _SkillChip(label: skill)
                            .animate()
                            .fadeIn(delay: (400 + (globalSkillIndex * 50)).ms, duration: 400.ms)
                            .slideY(begin: 0.2, end: 0, curve: Curves.easeOutBack);
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
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        transform: _isHovered ? Matrix4.translationValues(0, -5, 0) : Matrix4.identity(),
        decoration: BoxDecoration(
          color: const Color(0xFF112240),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
             color: _isHovered ? const Color(0xFF64FFDA) : Colors.transparent,
             width: 1.5
          ),
          boxShadow: _isHovered 
              ? [BoxShadow(color: const Color(0xFF64FFDA).withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 5))]
              : [],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
             Icon(
               Utils.getIconForSkill(widget.label), 
               size: 18, 
               color: _isHovered ? const Color(0xFF64FFDA) : Colors.white70
             ),
             const SizedBox(width: 8),
             Text(
               widget.label,
               style: TextStyle(
                 color: _isHovered ? const Color(0xFF64FFDA) : Colors.white70,
                 fontWeight: _isHovered ? FontWeight.bold : FontWeight.normal
               ),
             ),
          ],
        ),
      ),
    );
  }
}

// Simple utility to map skills to icons (optional gloss)
class Utils {
  static IconData getIconForSkill(String skill) {
    final s = skill.toLowerCase();
    if (s.contains('python') || s.contains('java') || s.contains('dart')) return Icons.code;
    if (s.contains('data') || s.contains('sql')) return Icons.storage;
    if (s.contains('cloud') || s.contains('gcp')) return Icons.cloud;
    if (s.contains('web') || s.contains('html')) return Icons.web;
    if (s.contains('design') || s.contains('figma')) return Icons.brush;
    if (s.contains('manage') || s.contains('business')) return Icons.business_center;
    if (s.contains('analytics')) return Icons.analytics;
    return Icons.check_circle_outline;
  }
}
