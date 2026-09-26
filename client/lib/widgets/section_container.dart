import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/palette.dart';

class SectionContainer extends StatelessWidget {
  final Widget child;
  final String title;
  final String subtitle;
  final Color backgroundColor;

  const SectionContainer({
      super.key,
      required this.child,
      required this.title,
      required this.subtitle,
      this.backgroundColor = AppColors.bg
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: backgroundColor,
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 100), // Increased vertical spacing
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1000), // Slightly wider
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2,
                ),
              ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.1, end: 0, curve: Curves.easeInOutCubic), // Reduced distance
              const SizedBox(height: 10),
              Text(
                subtitle,
                style: GoogleFonts.fraunces(
                  fontSize: MediaQuery.of(context).size.width < 800 ? 30 : 40,
                  fontWeight: FontWeight.w600,
                  fontStyle: FontStyle.italic,
                  color: AppColors.text,
                  height: 1.15,
                ),
              ).animate().fadeIn(delay: 200.ms, duration: 600.ms).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic), // Reduced distance (15px approx)
              const SizedBox(height: 60),
              child.animate().fadeIn(delay: 400.ms, duration: 600.ms).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic), // Subtle 10px approx
            ],
          ),
        ),
      ),
    );
  }
}
