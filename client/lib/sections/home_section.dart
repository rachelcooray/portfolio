import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';
import '../widgets/parse_rich_text.dart';

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
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 80),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 900),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Hi, my name is',
                style: TextStyle(
                  color: Theme.of(context).primaryColor,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              SelectableText(
                'Rachel Cooray.',
                style: GoogleFonts.outfit(
                  fontSize: 60,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              SelectableText(
                'Data Scientist & Developer.',
                style: GoogleFonts.outfit(
                  fontSize: 50,
                  fontWeight: FontWeight.bold,
                  color: Colors.white70,
                ),
              ),
              const SizedBox(height: 30),
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 600),
                child: const Text(
                  'I am a Computer Science graduate specializing in Data Science. I build accessible, pixel-perfect, and performant web experiences and analyze complex datasets.',
                  style: TextStyle(fontSize: 18, height: 1.5, color: Colors.white60),
                ),
              ),
              const SizedBox(height: 50),
              Row(
                children: [
                   ElevatedButton.icon(
                    onPressed: () => _launchUrl('https://github.com/rachelcooray'),
                    icon: const FaIcon(FontAwesomeIcons.github),
                    label: const Text('GitHub'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                      backgroundColor: Colors.transparent,
                      foregroundColor: Theme.of(context).primaryColor,
                      side: BorderSide(color: Theme.of(context).primaryColor),
                    ),
                  ),
                  const SizedBox(width: 20),
                   ElevatedButton.icon(
                    onPressed: () => _launchUrl('https://www.linkedin.com/in/rachel-cooray-069034235/'),
                    icon: const FaIcon(FontAwesomeIcons.linkedin),
                    label: const Text('LinkedIn'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                      backgroundColor: Colors.transparent,
                      foregroundColor: Theme.of(context).primaryColor,
                      side: BorderSide(color: Theme.of(context).primaryColor),
                    ),
                  ),
                  const SizedBox(width: 20),
                   ElevatedButton.icon(
                    onPressed: () => _launchUrl('rachelcooray-cv.pdf'),
                    icon: const FaIcon(FontAwesomeIcons.filePdf),
                    label: const Text('Download CV'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                      backgroundColor: Colors.transparent,
                      foregroundColor: Theme.of(context).primaryColor,
                      side: BorderSide(color: Theme.of(context).primaryColor),
                    ),
                  ),
                ],
              ),
              
              // Aspirations Block Moved Here
              if (_aspirations.isNotEmpty) ...[
                const SizedBox(height: 60),
                Container(
                  width: double.infinity,
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
                          baseStyle: GoogleFonts.outfit(fontSize: 18, height: 1.6, color: Colors.white),
                        ),
                    ],
                  ),
                ),
              ]
            ],
          ),
        ),
      ),
    );
  }
}

