import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/section_container.dart';
import '../theme/palette.dart';

/// A short standalone perspective piece — deliberately built only from
/// claims already evidenced elsewhere on the site (PCOS Care, the OCTAVE
/// dashboards, the CIMA RAG tutor), not new claims about expertise.
/// Treat as a first draft: Rachel should read and edit this before treating
/// it as her own voice.
class VisionSection extends StatelessWidget {
  const VisionSection({super.key});

  @override
  Widget build(BuildContext context) {
    return SectionContainer(
      title: 'Perspective',
      subtitle: 'On Decisions, Not Just Predictions',
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 760),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Most of the applied AI work I've done shares one constraint: a model's output only matters if the person reading it can act on it. A risk score for PCOS is only useful if a clinician can see which factors drove it. A margin-optimisation model is only useful if the incentive structure it recommends is one a distributor team can actually run. A study assistant built on a RAG pipeline is only useful if it stays inside the syllabus it's meant to teach, rather than answering fluently but wrong.",
              style: TextStyle(fontSize: 16.5, height: 1.65, color: AppColors.textMuted),
            ).animate().fadeIn(delay: 100.ms, duration: 500.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic),
            const SizedBox(height: 20),
            const Text(
              "That's the thread I keep pulling on: building analytics and AI systems that are transparent enough for the person on the other end to trust the decision, not just the number. In practice that's meant favouring interpretable feature selection over black-box performance gains, building dashboards around the specific decision someone needs to make rather than every metric available, and constraining generative systems to stay grounded in source material instead of improvising.",
              style: TextStyle(fontSize: 16.5, height: 1.65, color: AppColors.textMuted),
            ).animate().fadeIn(delay: 220.ms, duration: 500.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic),
            const SizedBox(height: 20),
            const Text(
              "It's also why teaching and data work don't feel like separate halves of what I do. Both are exercises in making something complex legible to someone who has to use it.",
              style: TextStyle(fontSize: 16.5, height: 1.65, color: AppColors.textMuted),
            ).animate().fadeIn(delay: 340.ms, duration: 500.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic),
          ],
        ),
      ),
    );
  }
}
