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
    const Widget aboutText = Text(
      "I'm Rachel Cooray, a Computer Science First Class Graduate and Data Science Intern at OCTAVE - John Keells Group.\n\n"
      "I have hands-on experience in Data Engineering, Machine Learning, and Full Stack Development. "
      "Recently, my project 'PCOS Care' won 3rd place at the University of Westminster Final Year Project Showcase. "
      "Strong communicator who translates complex data into actionable insights, optimizes business processes, and builds end-to-end solutions. "
      "Solid foundation in business analytics, enabling alignment of technical solutions with strategic objectives.",
      style: TextStyle(fontSize: 18, height: 1.6, color: Colors.white70),
    );

    return SectionContainer(
      title: '01. About Me',
      subtitle: 'Designing Solutions with Data',
      child: isMobile 
        ? Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              profileImage,
              const SizedBox(height: 30),
              aboutText,
            ],
          )
        : Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(flex: 3, child: aboutText),
              const SizedBox(width: 50),
              Expanded(flex: 2, child: profileImage),
            ],
          ),
    );
  }
}
