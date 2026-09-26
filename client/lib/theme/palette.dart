import 'package:flutter/material.dart';

/// Shared color tokens — clean monochrome base with a single blue accent,
/// reserved for CTAs, links, and small focal highlights. Chosen for a
/// Chevening/university-admissions/recruiter audience: the most universally
/// "professional and trustworthy" pattern, prints cleanly, and puts the
/// content ahead of the color story.
class AppColors {
  AppColors._();

  static const Color bg = Color(0xFFFFFFFF);
  static const Color surface = Color(0xFFF7F7F8);
  static const Color surfaceAlt = Color(0xFFFFFFFF);
  static const Color text = Color(0xFF111111);
  static const Color textMuted = Color(0xFF6B7280);
  static const Color textFaint = Color(0xFF9CA3AF);
  static const Color divider = Color(0xFFE5E7EB);

  // A deep burgundy — distinctive against the sea of "corporate blue"
  // portfolios, still muted and professional, and a quiet nod to
  // traditional academic branding (apt for a Chevening/university audience).
  static const Color accent = Color(0xFF8B1E3F);
  static const Color accentHover = Color(0xFF6B1730);
  static const Color accentSoft = Color(0xFFF6E4E9);

  static const Color secondary = Color(0xFF6B7280);
}
