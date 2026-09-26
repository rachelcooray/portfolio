import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/section_container.dart';
import '../services/api_service.dart';
import '../theme/palette.dart';

class ExperienceSection extends StatefulWidget {
  const ExperienceSection({super.key});

  @override
  State<ExperienceSection> createState() => _ExperienceSectionState();
}

class _ExperienceSectionState extends State<ExperienceSection> {
  // Collapsed by default — lower-relevance for a data/AI audience, shown
  // only if the reader wants more. Education & youth-work roles get their
  // own dedicated Teaching & Mentoring section instead of living here.
  bool _retailExpanded = false;

  @override
  Widget build(BuildContext context) {
    return SectionContainer(
      title: 'Experience',
      subtitle: 'Where I’ve Worked',
      child: FutureBuilder<List<dynamic>>(
        future: ApiService().getExperience(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: AppColors.accent));
          }
          if (snapshot.hasError) {
             return const Text("Failed to load experience", style: TextStyle(color: Colors.red));
          }

          final allExperience = snapshot.data ?? [];

          // Most relevant first: industry / data & tech roles, newest first.
          final industry = allExperience.where((e) => e['type'] == 'industry').toList();
          final retail = allExperience.where((e) => e['type'] == 'other' && e['subtype'] == 'retail_cs').toList();
          // Anything tagged "other" without a recognised subtype still shows, ungrouped, so nothing silently disappears.
          // (education_support roles are excluded here — they surface in their own Teaching & Mentoring section.)
          final otherUngrouped = allExperience.where((e) => e['type'] == 'other' && e['subtype'] != 'retail_cs' && e['subtype'] != 'education_support').toList();

          int globalIndex = 0;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
               if (industry.isNotEmpty) ...[
                 ...industry.map((e) {
                   final tile = _ExperienceTile(
                     title: e['title'],
                     company: e['company'],
                     date: e['date_range'],
                     summary: e['summary'],
                     details: List<String>.from(e['details'] ?? []),
                   ).animate().fadeIn(delay: (400 + (globalIndex * 100)).ms, duration: 600.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic);
                   globalIndex++;
                   return tile;
                 }),
               ],

               if (otherUngrouped.isNotEmpty) ...[
                 const SizedBox(height: 20),
                 ...otherUngrouped.map((e) => _ExperienceTile(
                       title: e['title'],
                       company: e['company'],
                       date: e['date_range'],
                       summary: e['summary'],
                       details: List<String>.from(e['details'] ?? []),
                     )),
               ],

               if (retail.isNotEmpty) ...[
                 const SizedBox(height: 30),
                 const Divider(color: AppColors.divider, height: 1),
                 const SizedBox(height: 24),
                 const Text(
                   'Also worked in',
                   style: TextStyle(fontSize: 13, color: AppColors.textFaint, fontWeight: FontWeight.w600, letterSpacing: 0.5),
                 ),
                 const SizedBox(height: 12),
                 _CollapsibleGroup(
                   title: 'Retail & Customer Service',
                   count: retail.length,
                   isExpanded: _retailExpanded,
                   onTap: () => setState(() => _retailExpanded = !_retailExpanded),
                   items: retail,
                 ),
               ],
            ],
          );
        },
      ),
    );
  }
}

class _CollapsibleGroup extends StatelessWidget {
  final String title;
  final int count;
  final bool isExpanded;
  final VoidCallback onTap;
  final List<dynamic> items;

  const _CollapsibleGroup({
    required this.title,
    required this.count,
    required this.isExpanded,
    required this.onTap,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          onTap: onTap,
          child: MouseRegion(
            cursor: SystemMouseCursors.click,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('$title ($count)', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.text)),
                  AnimatedRotation(
                    turns: isExpanded ? 0.5 : 0,
                    duration: const Duration(milliseconds: 250),
                    child: const Icon(Icons.expand_more, color: AppColors.textMuted, size: 20),
                  ),
                ],
              ),
            ),
          ),
        ),
        AnimatedCrossFade(
          firstChild: const SizedBox(width: double.infinity, height: 0),
          secondChild: Padding(
            padding: const EdgeInsets.only(top: 16),
            child: Column(
              children: items.map((e) => _ExperienceTile(
                    title: e['title'],
                    company: e['company'],
                    date: e['date_range'],
                    summary: e['summary'],
                    details: List<String>.from(e['details'] ?? []),
                  )).toList(),
            ),
          ),
          crossFadeState: isExpanded ? CrossFadeState.showSecond : CrossFadeState.showFirst,
          duration: const Duration(milliseconds: 250),
          sizeCurve: Curves.easeInOutCubic,
        ),
      ],
    );
  }
}

/// A plain, always-legible card — title/company/date/summary are visible
/// up front, no interaction required to read the headline of the role.
/// If there's more to say, a clearly-labelled "Details" row expands
/// inline (a dropdown), not a click-to-flip gimmick.
class _ExperienceTile extends StatefulWidget {
  final String title;
  final String company;
  final String date;
  final String summary;
  final List<String> details;

  const _ExperienceTile({
      required this.title,
      required this.company,
      required this.date,
      required this.summary,
      this.details = const []
  });

  @override
  State<_ExperienceTile> createState() => _ExperienceTileState();
}

class _ExperienceTileState extends State<_ExperienceTile> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppColors.surfaceAlt,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.divider),
      ),
      child: Stack(
        children: [
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            child: Container(
              width: 3,
              decoration: const BoxDecoration(
                color: AppColors.accent,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(16),
                  bottomLeft: Radius.circular(16),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(child: Text(widget.title, style: const TextStyle(fontSize: 19, fontWeight: FontWeight.bold, color: AppColors.text))),
                    Text(widget.date, style: const TextStyle(fontSize: 13, color: AppColors.textFaint, fontFamily: 'Fira Code')),
                  ],
                ),
                const SizedBox(height: 8),
                Text(widget.company, style: const TextStyle(fontSize: 15.5, color: AppColors.accent, fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Text(widget.summary, style: const TextStyle(fontSize: 15, color: AppColors.textMuted, height: 1.4)),
                if (widget.details.isNotEmpty) ...[
                  const SizedBox(height: 14),
                  GestureDetector(
                    onTap: () => setState(() => _expanded = !_expanded),
                    child: MouseRegion(
                      cursor: SystemMouseCursors.click,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(_expanded ? 'Hide details' : 'Show details', style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600, color: AppColors.accent)),
                          const SizedBox(width: 6),
                          AnimatedRotation(
                            turns: _expanded ? 0.5 : 0,
                            duration: const Duration(milliseconds: 200),
                            child: const Icon(Icons.expand_more, size: 18, color: AppColors.accent),
                          ),
                        ],
                      ),
                    ),
                  ),
                  AnimatedCrossFade(
                    firstChild: const SizedBox(width: double.infinity, height: 0),
                    secondChild: Padding(
                      padding: const EdgeInsets.only(top: 14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: widget.details.map((detail) => Padding(
                              padding: const EdgeInsets.only(bottom: 8.0),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text("▹ ", style: TextStyle(color: AppColors.accent, fontSize: 14)),
                                  Expanded(
                                    child: Text(
                                      detail.replaceAll('**', ''),
                                      style: const TextStyle(color: AppColors.textMuted, height: 1.45, fontSize: 14),
                                    ),
                                  ),
                                ],
                              ),
                            )).toList(),
                      ),
                    ),
                    crossFadeState: _expanded ? CrossFadeState.showSecond : CrossFadeState.showFirst,
                    duration: const Duration(milliseconds: 220),
                    sizeCurve: Curves.easeInOutCubic,
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
