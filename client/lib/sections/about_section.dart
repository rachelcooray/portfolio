import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/section_container.dart';

class AboutSection extends StatelessWidget {
  const AboutSection({super.key});

  @override
  Widget build(BuildContext context) {
    bool isMobile = MediaQuery.of(context).size.width < 800;
    
    // Define the profile image widget separately
    Widget profileImage = Container(
      width: 300,
      height: 300,
      decoration: BoxDecoration(
        border: Border.all(color: Theme.of(context).primaryColor, width: 2),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            top: 20,
            left: 20,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                border: Border.all(color: Theme.of(context).primaryColor.withOpacity(0.5), width: 2),
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          Image.asset(
            'assets/images/profile.png',
            fit: BoxFit.cover,
            width: 300,
            height: 300,
            errorBuilder: (context, error, stackTrace) => Container(
              color: Colors.grey[800],
              child: const Icon(Icons.person, size: 100, color: Colors.white),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: 600.ms, duration: 800.ms).slideX(begin: 0.2, end: 0, curve: Curves.easeOutCubic);

    // Define the text widget separately
    Widget aboutText = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SelectableText(
          "I'm a First Class Computer Science Graduate and Fullstack Developer with a passion for turning complex data into intuitive digital experiences.",
          style: GoogleFonts.outfit(fontSize: 18, height: 1.6, color: Colors.white),
        ).animate().fadeIn(delay: 500.ms, duration: 600.ms).slideY(begin: 0.1, end: 0),
        const SizedBox(height: 30),
        _buildBulletPoint(context, "Graduate Excellence", "First Class Honours with the 3rd Best Research Project award out of 200+ students.", 0),
        _buildBulletPoint(context, "Industry Impact", "Optimized distributor performance, increasing potential margins by 68% for a major FMCG company.", 1),
        _buildBulletPoint(context, "Fullstack Versatility", "Delivering end-to-end web and mobile solutions from UI/UX design to scalable backend integration.", 2),
        _buildBulletPoint(context, "Strategic Vision", "Combining technical expertise with business analytics to solve real-world problems.", 3),
      ],
    );

    return SectionContainer(
      title: '01. Who I Am',
      subtitle: 'About Me — Who I Am & What I Build',
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
          Text("▹", style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 20)),
          const SizedBox(width: 15),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: GoogleFonts.outfit(fontSize: 16, height: 1.5, color: Colors.white70),
                children: [
                  TextSpan(text: "$title: ", style: TextStyle(color: Theme.of(context).primaryColor, fontWeight: FontWeight.bold)),
                  TextSpan(text: description),
                ],
              ),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: (700 + (index * 150)).ms, duration: 600.ms).slideX(begin: -0.05, end: 0);
  }
}
