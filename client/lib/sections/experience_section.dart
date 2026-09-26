import 'package:flutter/material.dart';
import 'dart:math'; // For Flip Animation
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

          // Most relevant first: industry / data & tech roles, in the order
          // given (most recent and most senior first).
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

class _ExperienceTileState extends State<_ExperienceTile> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  bool _showFront = true;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600)
    );
    _animation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut)
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toggleFlip() {
    if (widget.details.isEmpty) return;
    if (_showFront) {
      _controller.forward();
    } else {
      _controller.reverse();
    }
    _showFront = !_showFront;
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _toggleFlip,
      child: AnimatedBuilder(
        animation: _animation,
        builder: (context, child) {
          final angle = _animation.value * pi;
          final isBack = _animation.value >= 0.5;

          return Transform(
            transform: Matrix4.identity()
              ..setEntry(3, 2, 0.001) // Perspective
              ..rotateY(angle),
            alignment: Alignment.center,
            child: isBack
                ? Transform(
                    alignment: Alignment.center,
                    transform: Matrix4.identity()..rotateY(pi), // Mirror back side to look correct
                    child: _buildBack(),
                  )
                : _buildFront(),
          );
        },
      ),
    );
  }

  Widget _buildCardBase({required Widget child}) {
    return Container(
      height: 220,
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 20),
      // Use Stack to achieve the left accent line effect safely
      child: Stack(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surfaceAlt,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.divider),
            ),
            child: child,
          ),
          // Left Accent Line
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
                )
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildFront() {
    return _buildCardBase(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
           Row(
             mainAxisAlignment: MainAxisAlignment.spaceBetween,
             children: [
               Expanded(child: Text(widget.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.text))),
               if (widget.details.isNotEmpty)
                 const Icon(Icons.touch_app, color: AppColors.divider, size: 20),
             ],
           ),
           const SizedBox(height: 10),
           Text(widget.company, style: const TextStyle(fontSize: 16, color: AppColors.accent, fontWeight: FontWeight.w600)),
           const SizedBox(height: 5),
           Text(widget.date, style: const TextStyle(fontSize: 14, color: AppColors.textFaint, fontFamily: 'Fira Code')),
           const SizedBox(height: 15),
           Text(widget.summary, style: const TextStyle(fontSize: 16, color: AppColors.textMuted, height: 1.4)),
        ],
      ),
    );
  }

  Widget _buildBack() {
    return _buildCardBase(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
             mainAxisAlignment: MainAxisAlignment.spaceBetween,
             children: [
               const Text("Key Details", style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.bold)),
               const Icon(Icons.undo, color: AppColors.divider, size: 20)
             ],
           ),
           const SizedBox(height: 10),
           Expanded(
             child: SingleChildScrollView( // Allow scrolling if content exceeds fixed height
               child: Column(
                 children: widget.details.map((detail) => Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("▹ ", style: TextStyle(color: AppColors.accent, fontSize: 14)),
                        Expanded(
                          child: Text(
                            detail.replaceAll('**', ''),
                            style: const TextStyle(color: AppColors.textMuted, height: 1.4, fontSize: 14),
                          ),
                        ),
                      ],
                    ),
                  )).toList(),
               ),
             ),
           )
        ],
      )
    );
  }
}
