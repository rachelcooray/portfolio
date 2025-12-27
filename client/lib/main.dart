import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'sections/home_section.dart';
import 'sections/about_section.dart';
import 'sections/experience_section.dart';
import 'sections/skills_section.dart';
import 'sections/projects_section.dart';
import 'widgets/additional_sections.dart';
import 'sections/contact_section.dart';

void main() {
  runApp(const PortfolioApp());
}

class PortfolioApp extends StatelessWidget {
  const PortfolioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Rachel Cooray | Portfolio',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0A0E21),
        primaryColor: const Color(0xFF64FFDA),
        textTheme: GoogleFonts.outfitTextTheme(
          Theme.of(context).textTheme,
        ).apply(bodyColor: Colors.white, displayColor: Colors.white),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF64FFDA),
          secondary: Color(0xFF112240),
        ),
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final ScrollController _scrollController = ScrollController();
  
  final GlobalKey _homeKey = GlobalKey();
  final GlobalKey _aboutKey = GlobalKey();
  final GlobalKey _experienceKey = GlobalKey();
  final GlobalKey _skillsKey = GlobalKey();
  final GlobalKey _projectsKey = GlobalKey();
  final GlobalKey _contactKey = GlobalKey();

  void _scrollTo(GlobalKey key) {
    Scrollable.ensureVisible(
      key.currentContext!,
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('RC', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF64FFDA))),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          // On mobile, you might want a Drawer instead, but for now we fit them or Wrap
          if (MediaQuery.of(context).size.width > 800) ...[
            TextButton(onPressed: () => _scrollTo(_aboutKey), child: const Text('About')),
            TextButton(onPressed: () => _scrollTo(_experienceKey), child: const Text('Experience')),
            TextButton(onPressed: () => _scrollTo(_skillsKey), child: const Text('Skills')),
            TextButton(onPressed: () => _scrollTo(_projectsKey), child: const Text('Projects')),
            TextButton(onPressed: () => _scrollTo(_contactKey), child: const Text('Contact')),
          ] else ...[
            IconButton(icon: const Icon(Icons.menu), onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Mobile Menu Implementation Todo")));
            })
          ],
          const SizedBox(width: 20),
        ],
      ),
      body: SingleChildScrollView(
        controller: _scrollController,
        child: Column(
          children: [
            HomeSection(key: _homeKey),
            AboutSection(key: _aboutKey),
            ExperienceSection(key: _experienceKey),
            SkillsSection(key: _skillsKey),
            ProjectsSection(key: _projectsKey),
            const AdditionalSections(),
            ContactSection(key: _contactKey),
            const SizedBox(height: 50),
            const Text("© 2024 Rachel Cooray", style: TextStyle(color: Colors.white54)),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
