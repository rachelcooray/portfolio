import 'package:flutter/material.dart';
import '../widgets/section_container.dart';

class AboutSection extends StatelessWidget {
  const AboutSection({super.key});

  @override
  Widget build(BuildContext context) {
    final bool isMobile = MediaQuery.of(context).size.width < 800;
    
    // Define the image widget separately for reuse
    Widget profileImage = Container(
      height: 300,
      width: isMobile ? double.infinity : null, // Full width on mobile
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Theme.of(context).primaryColor),
        color: const Color(0xFF112240),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: Image.asset(
          'assets/images/profile.png',
          fit: BoxFit.cover,
        ),
      ),
    );

    // Define the text widget separately
    Widget aboutText = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SelectableText(
          "I'm a First Class Computer Science Graduate and Fullstack Developer with a passion for turning complex data into intuitive digital experiences.",
          style: GoogleFonts.outfit(fontSize: 18, height: 1.6, color: Colors.white),
        ),
        const SizedBox(height: 30),
        _buildBulletPoint(context, "Graduate Excellence", "First Class Honours with the 3rd Best Research Project award out of 200+ students."),
        _buildBulletPoint(context, "Industry Impact", "Optimized distributor performance, increasing potential margins by 68% for a major FMCG company."),
        _buildBulletPoint(context, "Fullstack Versatility", "Delivering end-to-end web and mobile solutions from UI/UX design to scalable backend integration."),
        _buildBulletPoint(context, "Strategic Vision", "Combining technical expertise with business analytics to solve real-world problems."),
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

  Widget _buildBulletPoint(BuildContext context, String title, String description) {
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
    );
  }
}
