import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'sections/home_section.dart';
import 'sections/about_section.dart';
import 'sections/experience_section.dart';
import 'sections/skills_section.dart';
import 'sections/projects_section.dart';
import 'sections/awards_section.dart';
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
  double _scrollOpacity = 0;
  
  final GlobalKey _homeKey = GlobalKey();
  final GlobalKey _aboutKey = GlobalKey();
  final GlobalKey _experienceKey = GlobalKey();
  final GlobalKey _skillsKey = GlobalKey();
  final GlobalKey _projectsKey = GlobalKey();
  final GlobalKey _awardsKey = GlobalKey();
  final GlobalKey _contactKey = GlobalKey();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(() {
      double offset = _scrollController.offset;
      double newOpacity = (offset / 100).clamp(0, 1);
      if (newOpacity != _scrollOpacity) {
        setState(() => _scrollOpacity = newOpacity);
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollTo(GlobalKey key) {
    Scrollable.ensureVisible(
      key.currentContext!,
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeInOutCubic,
    );
  }

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      extendBodyBehindAppBar: true,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(70),
        child: Container(
          decoration: BoxDecoration(
            color: const Color(0xFF0A0E21).withOpacity(_scrollOpacity * 0.8),
          ),
          child: AppBar(
            automaticallyImplyLeading: false,
            title: Text('RC', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF64FFDA))),
            backgroundColor: Colors.transparent,
            elevation: 0,
            actions: [
              if (MediaQuery.of(context).size.width > 800) ...[
                _NavButton(label: 'About', onTap: () => _scrollTo(_aboutKey)),
                _NavButton(label: 'Experience', onTap: () => _scrollTo(_experienceKey)),
                _NavButton(label: 'Skills', onTap: () => _scrollTo(_skillsKey)),
                _NavButton(label: 'Projects', onTap: () => _scrollTo(_projectsKey)),
                _NavButton(label: 'Awards', onTap: () => _scrollTo(_awardsKey)),
                _NavButton(label: 'Contact', onTap: () => _scrollTo(_contactKey)),
              ] else ...[
                IconButton(
                  icon: const Icon(Icons.menu, color: Color(0xFF64FFDA)), 
                  onPressed: () => _scaffoldKey.currentState?.openEndDrawer()
                )
              ],
              const SizedBox(width: 20),
            ],
          ),
        ),
      ),
      endDrawer: Drawer(
        backgroundColor: const Color(0xFF112240),
        child: ListView(
          padding: const EdgeInsets.symmetric(vertical: 50, horizontal: 20),
          children: [
            ListTile(
              title: const Text('About', style: TextStyle(color: Colors.white, fontSize: 18)),
              onTap: () { Navigator.pop(context); _scrollTo(_aboutKey); },
            ),
            ListTile(
              title: const Text('Experience', style: TextStyle(color: Colors.white, fontSize: 18)),
              onTap: () { Navigator.pop(context); _scrollTo(_experienceKey); },
            ),
            ListTile(
              title: const Text('Skills', style: TextStyle(color: Colors.white, fontSize: 18)),
              onTap: () { Navigator.pop(context); _scrollTo(_skillsKey); },
            ),
            ListTile(
              title: const Text('Projects', style: TextStyle(color: Colors.white, fontSize: 18)),
              onTap: () { Navigator.pop(context); _scrollTo(_projectsKey); },
            ),
            ListTile(
              title: const Text('Awards', style: TextStyle(color: Colors.white, fontSize: 18)),
              onTap: () { Navigator.pop(context); _scrollTo(_awardsKey); },
            ),
            ListTile(
              title: const Text('Contact', style: TextStyle(color: Colors.white, fontSize: 18)),
              onTap: () { Navigator.pop(context); _scrollTo(_contactKey); },
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        controller: _scrollController,
        physics: const ClampingScrollPhysics(),
        child: Column(
          children: [
            HomeSection(key: _homeKey),
            AboutSection(key: _aboutKey),
            ExperienceSection(key: _experienceKey),
            SkillsSection(key: _skillsKey),
            ProjectsSection(key: _projectsKey),
            const PublicationsSection(),
            const VolunteeringSection(),
            AwardsSection(key: _awardsKey),
            const FeaturedSection(),
            ContactSection(key: _contactKey),
            const SizedBox(height: 50),
            const Text("© 2025 Rachel Cooray", style: TextStyle(color: Colors.white54)),
            const SizedBox(height: 50),
          ],
        ),
      ),
    );
  }
}

class _NavButton extends StatefulWidget {
  final String label;
  final VoidCallback onTap;
  const _NavButton({required this.label, required this.onTap});

  @override
  State<_NavButton> createState() => _NavButtonState();
}

class _NavButtonState extends State<_NavButton> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: TextButton(
        onPressed: widget.onTap,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(widget.label, style: TextStyle(color: _isHovered ? const Color(0xFF64FFDA) : Colors.white)),
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              height: 2,
              width: _isHovered ? 20 : 0,
              color: const Color(0xFF64FFDA),
            ),
          ],
        ),
      ),
    );
  }
}
