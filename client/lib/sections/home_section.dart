import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class HomeSection extends StatelessWidget {
  const HomeSection({super.key});

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
              )
            ],
          ),
        ),
      ),
    );
  }
}

class _HomeButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final bool outline;

  const _HomeButton({required this.label, required this.onTap, this.outline = false});

  @override
  Widget build(BuildContext context) {
    if (outline) {
      return OutlinedButton(
        onPressed: onTap,
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 20),
          side: BorderSide(color: Theme.of(context).primaryColor),
          foregroundColor: Theme.of(context).primaryColor,
          textStyle: const TextStyle(fontSize: 16),
        ),
        child: Text(label),
      );
    }
    return ElevatedButton(
      onPressed: onTap,
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 20),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: const Color(0xFF0A192F),
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
      ),
      child: Text(label),
    );
  }
}
