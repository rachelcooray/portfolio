import 'package:flutter/material.dart';
import '../widgets/section_container.dart';

class AboutSection extends StatelessWidget {
  const AboutSection({super.key});

  @override
  Widget build(BuildContext context) {
    return SectionContainer(
      title: '01. About Me',
      subtitle: 'Who I Am',
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 3,
            child: const Text(
              "I'm Rachel Cooray, a Computer Science First Class Graduate and Data Science Intern at OCTAVE - John Keells Group.\n\n"
              "I have hands-on experience in Data Engineering, Machine Learning, and Full Stack Development. "
              "Recently, my project 'PCOS Care' won 3rd place at the University of Westminster Final Year Project Showcase. "
              "I am proficient in Python, SQL, GCP, and Power BI, with a strong background in both technical implementation and business accounting (CIMA).",
              style: TextStyle(fontSize: 18, height: 1.6, color: Colors.white70),
            ),
          ),
          const SizedBox(width: 50),
          // Placeholder for an image if desired
          Expanded(
            flex: 2,
             child: Container(
               height: 300,
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
             ),
          )
        ],
      ),
    );
  }
}
