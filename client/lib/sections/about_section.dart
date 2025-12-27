import 'package:flutter/material.dart';
import '../widgets/section_container.dart';
import '../services/api_service.dart';
import '../widgets/parse_rich_text.dart';

class AboutSection extends StatefulWidget {
  const AboutSection({super.key});

  @override
  State<AboutSection> createState() => _AboutSectionState();
}

class _AboutSectionState extends State<AboutSection> {
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

  @override
  Widget build(BuildContext context) {
    return SectionContainer(
      title: '01. About Me',
      subtitle: 'Designing Solutions with Data',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Aspirations Block (Visible if data exists)
          if (_aspirations.isNotEmpty)
            Container(
              width: double.infinity,
              margin: const EdgeInsets.only(bottom: 40),
              padding: const EdgeInsets.all(25),
              decoration: BoxDecoration(
                color: const Color(0xFF112240),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Theme.of(context).primaryColor.withOpacity(0.3)),
                 boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 10, offset: const Offset(0, 5))]
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                    Text("💡 MY ASPIRATION", style: TextStyle(color: Theme.of(context).primaryColor, fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                    const SizedBox(height: 10),
                    ParseRichText(
                      text: _aspirations,
                      baseStyle: const TextStyle(fontSize: 18, height: 1.6, color: Colors.white, fontStyle: FontStyle.italic),
                    ),
                ],
              ),
            ),
          
          Row(
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
              if (MediaQuery.of(context).size.width > 800) ...[
                const SizedBox(width: 50),
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
              ]
            ],
          ),
        ],
      ),
    );
  }
}
