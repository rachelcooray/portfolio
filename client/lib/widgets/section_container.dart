import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';

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
      this.backgroundColor = const Color(0xFF0A0E21)
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
                style: TextStyle(
                  color: Theme.of(context).primaryColor,
                  fontSize: 14,
                  fontFamily: 'Fira Code',
                  letterSpacing: 2,
                ),
              ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.1, end: 0, curve: Curves.easeInOutCubic), // Reduced distance
              const SizedBox(height: 10),
              Text(
                subtitle,
                style: GoogleFonts.outfit(
                  fontSize: MediaQuery.of(context).size.width < 800 ? 36 : 48,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  height: 1.2,
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
