import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:animated_text_kit/animated_text_kit.dart';
import '../services/api_service.dart';
import '../widgets/parse_rich_text.dart';
import '../theme/palette.dart';

class HomeSection extends StatefulWidget {
  const HomeSection({super.key});

  @override
  State<HomeSection> createState() => _HomeSectionState();
}

class _HomeSectionState extends State<HomeSection> {
  final ApiService _apiService = ApiService();
  String _aspirations = '';

  @override
  void initState() {
    super.initState();
    _loadAspirations();
  }

  void _loadAspirations() async {
    final text = await _apiService.getAspirations();
    if (mounted) setState(() => _aspirations = text);
  }

  Future<void> _launchUrl(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri)) {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minHeight: 600),
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 100),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 900),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'DATA SCIENCE · FULL-STACK ENGINEERING',
                style: TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.5,
                ),
              ).animate().fadeIn(duration: 450.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic),
              const SizedBox(height: 20),
              SelectableText(
                'Rachel Cooray',
                style: GoogleFonts.fraunces(
                  fontSize: 64,
                  fontWeight: FontWeight.w600,
                  fontStyle: FontStyle.italic,
                  letterSpacing: -0.5,
                  color: AppColors.text,
                ),
              ).animate().fadeIn(delay: 150.ms, duration: 450.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic),
              SizedBox(
                height: 60, // Fixed height to prevent layout jump during typing
                child: DefaultTextStyle(
                  style: GoogleFonts.figtree(
                    fontSize: 34,
                    fontWeight: FontWeight.w600,
                    color: AppColors.accent,
                  ),
                  child: AnimatedTextKit(
                    repeatForever: true,
                    animatedTexts: [
                      TypewriterAnimatedText('Data Scientist.', speed: const Duration(milliseconds: 100)),
                      TypewriterAnimatedText('Full-stack Developer.', speed: const Duration(milliseconds: 100)),
                      TypewriterAnimatedText('AI/ML Enthusiast.', speed: const Duration(milliseconds: 100)),
                    ],
                  ),
                ),
              ).animate().fadeIn(delay: 300.ms, duration: 450.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic),
              const SizedBox(height: 24),
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 620),
                child: const Text(
                  'Data Scientist, full-stack engineer, and educator working across applied AI, business analytics, and decision-support tooling — turning research and data into systems people can actually act on.',
                  style: TextStyle(fontSize: 18, height: 1.55, color: AppColors.textMuted),
                ),
              ).animate().fadeIn(delay: 450.ms, duration: 450.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic),
              const SizedBox(height: 40),
              Wrap(
                spacing: 14,
                runSpacing: 14,
                children: [
                  ElevatedButton.icon(
                    onPressed: () => _launchUrl('rachelcooray-cv.pdf'),
                    icon: const FaIcon(FontAwesomeIcons.filePdf, size: 16),
                    label: const Text('Download CV'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
                      backgroundColor: AppColors.accent,
                      foregroundColor: AppColors.bg,
                      elevation: 0,
                      shape: const StadiumBorder(),
                    ),
                  ),
                  OutlinedButton.icon(
                    onPressed: () => _launchUrl('https://github.com/rachelcooray'),
                    icon: const FaIcon(FontAwesomeIcons.github, size: 16),
                    label: const Text('GitHub'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
                      foregroundColor: AppColors.text,
                      side: const BorderSide(color: AppColors.divider),
                      shape: const StadiumBorder(),
                    ),
                  ),
                  OutlinedButton.icon(
                    onPressed: () => _launchUrl('https://www.linkedin.com/in/rachel-cooray-069034235/'),
                    icon: const FaIcon(FontAwesomeIcons.linkedin, size: 16),
                    label: const Text('LinkedIn'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
                      foregroundColor: AppColors.text,
                      side: const BorderSide(color: AppColors.divider),
                      shape: const StadiumBorder(),
                    ),
                  ),
                ],
              ).animate().fadeIn(delay: 600.ms, duration: 450.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic),

              const SizedBox(height: 56),

              // Proof strip — the headline credentials, surfaced above the fold
              // for reviewers/recruiters who only skim the hero.
              const _ProofStrip(),

              // Aspirations Block
              if (_aspirations.isNotEmpty) ...[
                const SizedBox(height: 40),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(25),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceAlt,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.divider),
                     boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 5))]
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                        const Text("MY ASPIRATION", style: TextStyle(color: AppColors.textFaint, fontSize: 13, fontWeight: FontWeight.w700, letterSpacing: 1.2)),
                        const SizedBox(height: 10),
                        ParseRichText(
                          text: _aspirations,
                          baseStyle: const TextStyle(fontSize: 17, height: 1.6, color: AppColors.text),
                        ),
                    ],
                  ),
                ).animate().fadeIn(delay: 750.ms, duration: 600.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic),
              ]
            ],
          ).animate().fadeIn(duration: 800.ms, curve: Curves.easeInOutCubic).scale(begin: const Offset(0.98, 0.98), end: const Offset(1, 1), curve: Curves.easeInOutCubic),
        ),
      ),
    );
  }
}

class _ProofStrip extends StatelessWidget {
  const _ProofStrip();

  static const _proof = [
    (value: 'First Class', label: 'BSc (Hons) Computer Science', note: 'University of Westminster, 2025'),
    (value: 'IEEE ICAHS 2025', label: 'Conference publication', note: 'PCOS Care, Tunisia'),
    (value: '3rd Place', label: 'Final-year research project', note: 'Westminster showcase, with Netcompany'),
    (value: '+68%', label: 'Distributor margin uplift', note: 'KPI design at OCTAVE, John Keells Group'),
  ];

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: _proof.asMap().entries.map((entry) {
        final p = entry.value;
        return Container(
          width: 220,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          decoration: BoxDecoration(
            color: AppColors.surfaceAlt,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 4))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(p.value, style: GoogleFonts.fraunces(fontSize: 22, fontWeight: FontWeight.w600, color: AppColors.text)),
              const SizedBox(height: 4),
              Text(p.label, style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600, color: AppColors.text)),
              const SizedBox(height: 3),
              Text(p.note, style: const TextStyle(fontSize: 12.5, color: AppColors.textFaint, height: 1.4)),
            ],
          ),
        ).animate().fadeIn(delay: (650 + (entry.key * 80)).ms, duration: 450.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.08, end: 0, curve: Curves.easeInOutCubic);
      }).toList(),
    );
  }
}
