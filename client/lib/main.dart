import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'sections/home_section.dart';
import 'sections/about_section.dart';
import 'sections/education_section.dart';
import 'sections/experience_section.dart';
import 'sections/skills_section.dart';
import 'sections/projects_section.dart';
import 'sections/awards_section.dart';
import 'widgets/additional_sections.dart';
import 'sections/contact_section.dart';
import 'theme/palette.dart';

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
      theme: ThemeData.light().copyWith(
        scaffoldBackgroundColor: AppColors.bg,
        primaryColor: AppColors.accent,
        textTheme: GoogleFonts.figtreeTextTheme(
          Theme.of(context).textTheme,
        ).apply(bodyColor: AppColors.text, displayColor: AppColors.text),
        colorScheme: const ColorScheme.light(
          primary: AppColors.accent,
          secondary: AppColors.secondary,
          surface: AppColors.surface,
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
  final GlobalKey _publicationsKey = GlobalKey();
  final GlobalKey _educationKey = GlobalKey();
  final GlobalKey _experienceKey = GlobalKey();
  final GlobalKey _projectsKey = GlobalKey();
  final GlobalKey _skillsKey = GlobalKey();
  final GlobalKey _awardsKey = GlobalKey();
  final GlobalKey _beyondKey = GlobalKey();
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
            color: AppColors.bg.withOpacity(_scrollOpacity * 0.92),
            border: Border(bottom: BorderSide(color: AppColors.divider.withOpacity(_scrollOpacity))),
          ),
          child: AppBar(
            automaticallyImplyLeading: false,
            title: Text('Rachel Cooray', style: GoogleFonts.fraunces(fontSize: 19, fontWeight: FontWeight.w600, fontStyle: FontStyle.italic, color: AppColors.text)),
            backgroundColor: Colors.transparent,
            elevation: 0,
            actions: [
              if (MediaQuery.of(context).size.width > 900) ...[
                _NavButton(label: 'About', onTap: () => _scrollTo(_aboutKey)),
                _NavButton(label: 'Publications', onTap: () => _scrollTo(_publicationsKey)),
                _NavButton(label: 'Education', onTap: () => _scrollTo(_educationKey)),
                _NavButton(label: 'Experience', onTap: () => _scrollTo(_experienceKey)),
                _NavButton(label: 'Projects', onTap: () => _scrollTo(_projectsKey)),
                _NavButton(label: 'Skills', onTap: () => _scrollTo(_skillsKey)),
                _NavButton(label: 'Awards', onTap: () => _scrollTo(_awardsKey)),
                _NavButton(label: 'Beyond Work', onTap: () => _scrollTo(_beyondKey)),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: () => _scrollTo(_contactKey),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.accent,
                    foregroundColor: AppColors.bg,
                    elevation: 0,
                    shape: const StadiumBorder(),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  ),
                  child: const Text('Contact'),
                ),
              ] else ...[
                IconButton(
                  icon: const Icon(Icons.menu, color: AppColors.text),
                  onPressed: () => _scaffoldKey.currentState?.openEndDrawer()
                )
              ],
              const SizedBox(width: 20),
            ],
          ),
        ),
      ),
      endDrawer: Drawer(
        backgroundColor: AppColors.surface,
        child: ListView(
          padding: const EdgeInsets.symmetric(vertical: 50, horizontal: 20),
          children: [
            _DrawerItem(label: 'About', onTap: () { Navigator.pop(context); _scrollTo(_aboutKey); }),
            _DrawerItem(label: 'Publications', onTap: () { Navigator.pop(context); _scrollTo(_publicationsKey); }),
            _DrawerItem(label: 'Education', onTap: () { Navigator.pop(context); _scrollTo(_educationKey); }),
            _DrawerItem(label: 'Experience', onTap: () { Navigator.pop(context); _scrollTo(_experienceKey); }),
            _DrawerItem(label: 'Projects', onTap: () { Navigator.pop(context); _scrollTo(_projectsKey); }),
            _DrawerItem(label: 'Skills', onTap: () { Navigator.pop(context); _scrollTo(_skillsKey); }),
            _DrawerItem(label: 'Awards', onTap: () { Navigator.pop(context); _scrollTo(_awardsKey); }),
            _DrawerItem(label: 'Beyond Work', onTap: () { Navigator.pop(context); _scrollTo(_beyondKey); }),
            _DrawerItem(label: 'Contact', onTap: () { Navigator.pop(context); _scrollTo(_contactKey); }),
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
            PublicationsSection(key: _publicationsKey),
            EducationSection(key: _educationKey),
            ExperienceSection(key: _experienceKey),
            ProjectsSection(key: _projectsKey),
            SkillsSection(key: _skillsKey),
            AwardsSection(key: _awardsKey),
            BeyondWorkSection(key: _beyondKey),
            ContactSection(key: _contactKey),
            const SizedBox(height: 50),
            const Text("© 2026 Rachel Cooray", style: TextStyle(color: AppColors.textFaint)),
            const SizedBox(height: 50),
          ],
        ),
      ),
    );
  }
}

class _DrawerItem extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  const _DrawerItem({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(label, style: const TextStyle(color: AppColors.text, fontSize: 18)),
      onTap: onTap,
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
            Text(widget.label, style: TextStyle(color: _isHovered ? AppColors.accent : AppColors.text)),
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              height: 2,
              width: _isHovered ? 20 : 0,
              color: AppColors.accent,
            ),
          ],
        ),
      ),
    );
  }
}
