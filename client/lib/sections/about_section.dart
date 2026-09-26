import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/section_container.dart';
import '../theme/palette.dart';

class AboutSection extends StatelessWidget {
  const AboutSection({super.key});

  @override
  Widget build(BuildContext context) {
    bool isMobile = MediaQuery.of(context).size.width < 800;

    // Define the profile image widget separately
    Widget profileImage = Container(
      width: 280,
      height: 280,
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.divider, width: 1),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10))],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(15),
        child: Image.asset(
          'assets/images/profile.png',
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) => Container(
            color: AppColors.surface,
            child: const Icon(Icons.person, size: 100, color: AppColors.textFaint),
          ),
        ),
      ),
    ).animate().fadeIn(delay: 600.ms, duration: 600.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic);

    // Define the text widget separately
    Widget aboutText = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SelectableText(
          "I'm a First Class Computer Science graduate with industry experience in data science, analytics, and full-stack development. I transform complex data into meaningful insights and build end-to-end digital solutions that drive business impact.",
          style: TextStyle(
            fontSize: 18,
            height: 1.6,
            color: AppColors.text,
          ),
        ).animate().fadeIn(delay: 500.ms, duration: 600.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic),

        const SizedBox(height: 30),

        _buildBulletPoint(
          context,
          "Data Science & Analytics",
          "Specialized in Python-based ML, ETL pipelines (GCP), KPI optimisation, and delivering insights that enable data-driven decisions.",
          0,
        ),

        _buildBulletPoint(
          context,
          "Academic Excellence",
          "First Class Honours, Scholarship recipient, and awarded 3rd Best Research Project out of 400+ students with an IEEE conference publication.",
          1,
        ),

        _buildBulletPoint(
          context,
          "Industry Impact",
          "Improved distributor margins and delivered high-value analytics dashboards for leadership decision-making for a major FMCG company.",
          2,
        ),

        _buildBulletPoint(
          context,
          "Full-Stack & Cloud Engineering",
          "Experience building scalable web and mobile applications using Flutter, Flask, Node.js, and cloud-based data pipelines.",
          3,
        ),
      ],
    );

    return SectionContainer(
      title: 'About',
      subtitle: 'Who I Am & What I Build',
      child: isMobile
        ? Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              profileImage,
              const SizedBox(height: 50),
              aboutText,
            ],
          )
        : Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(flex: 3, child: aboutText),
              const SizedBox(width: 60),
              Expanded(flex: 2, child: profileImage),
            ],
          ),
    );
  }

  Widget _buildBulletPoint(BuildContext context, String title, String description, int index) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("▹", style: TextStyle(color: AppColors.accent, fontSize: 20)),
          const SizedBox(width: 15),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: const TextStyle(fontSize: 16, height: 1.5, color: AppColors.textMuted),
                children: [
                  TextSpan(text: "$title: ", style: const TextStyle(color: AppColors.text, fontWeight: FontWeight.bold)),
                  TextSpan(text: description),
                ],
              ),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: (700 + (index * 100)).ms, duration: 600.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic);
  }
}
