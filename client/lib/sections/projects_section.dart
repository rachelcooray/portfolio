import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../services/api_service.dart';
import '../widgets/section_container.dart';
import 'package:url_launcher/url_launcher.dart';

class ProjectsSection extends StatefulWidget {
  const ProjectsSection({super.key});

  @override
  State<ProjectsSection> createState() => _ProjectsSectionState();
}

class _ProjectsSectionState extends State<ProjectsSection> {
  final ApiService _apiService = ApiService();
  late Future<List<dynamic>> _projectsFuture;

  @override
  void initState() {
    super.initState();
    _projectsFuture = _apiService.getProjects();
  }

  @override
  Widget build(BuildContext context) {
    return SectionContainer(
      title: '04. Selected Case Studies',
      subtitle: 'Projects',
      backgroundColor: const Color(0xFF0F172A),
      child: FutureBuilder<List<dynamic>>(
        future: _projectsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No projects found.'));
          }

          final projects = snapshot.data!;
          return SizedBox(
            height: 400, // Slightly taller for buttons
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: projects.length,
              itemBuilder: (context, index) {
                final project = projects[index];
                return Padding(
                  padding: const EdgeInsets.only(right: 30),
                  child: _ProjectCard(project: project).animate().fadeIn(delay: (400 + (index * 100)).ms, duration: 450.ms, curve: Curves.easeInOutCubic).slideX(begin: 0.05, end: 0, curve: Curves.easeInOutCubic),
                );
              },
            ),
          );
        },
      ),
    );
  }
}

class _ProjectCard extends StatefulWidget {
  final dynamic project;

  const _ProjectCard({required this.project});

  @override
  State<_ProjectCard> createState() => _ProjectCardState();
}

class _ProjectCardState extends State<_ProjectCard> {
  bool _isHovered = false;

  Future<void> _launchUrl(String? url) async {
    if (url == null) return;
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri)) {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 700;
    final cardWidth = isMobile ? 310.0 : 280.0;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: () => _launchUrl(widget.project['link']),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeInOutCubic,
          width: cardWidth,
          transform: _isHovered ? (Matrix4.identity()..scale(1.02, 1.02)) : Matrix4.identity(),
          decoration: BoxDecoration(
            color: const Color(0xFF112240),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: _isHovered ? const Color(0xFF64FFDA).withOpacity(0.5) : Colors.white10),
            boxShadow: _isHovered
                ? [
                    BoxShadow(
                        color: const Color(0xFF64FFDA).withOpacity(0.1),
                        blurRadius: 20,
                        offset: const Offset(0, 10))
                  ]
                : [
                    BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 10,
                        offset: const Offset(0, 5))
                  ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(15),
            child: Stack(
              children: [
                // Content
                Padding(
                  padding: const EdgeInsets.all(25.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Image or Icon
                      Container(
                        height: 160,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: Colors.black26,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: widget.project['image'] != null
                            ? ClipRRect(
                                borderRadius: BorderRadius.circular(10),
                                child: Image.asset(widget.project['image'], fit: BoxFit.cover),
                              )
                            : Icon(Icons.folder_open, size: 40, color: Theme.of(context).primaryColor),
                      ),
                      const SizedBox(height: 20),
                      // Title
                      Text(
                        widget.project['title'] ?? '',
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.outfit(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 5),
                      // Role
                      Text(
                        widget.project['role'] ?? 'Developer',
                        style: TextStyle(
                          color: Theme.of(context).primaryColor,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const Spacer(),
                      // CTA
                      Row(
                        children: [
                          Text(
                            "View Details",
                            style: GoogleFonts.outfit(
                              color: Colors.white70,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 8),
                          AnimatedPadding(
                            duration: const Duration(milliseconds: 200),
                            padding: EdgeInsets.only(left: _isHovered ? 8 : 0),
                            child: Icon(
                              Icons.arrow_forward_rounded,
                              size: 16,
                              color: Theme.of(context).primaryColor,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                
                // Hover Overlay for Tech Stack
                AnimatedOpacity(
                  duration: const Duration(milliseconds: 200),
                  opacity: _isHovered ? 1.0 : 0.0,
                  child: Container(
                    padding: const EdgeInsets.all(25),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0A192F).withOpacity(0.95),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Tech Stack",
                          style: TextStyle(
                            color: Theme.of(context).primaryColor,
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        const SizedBox(height: 15),
                        Expanded(
                          child: Wrap(
                            spacing: 10,
                            runSpacing: 10,
                            children: (widget.project['tech'] as List<dynamic>? ?? []).map<Widget>((tech) {
                              return Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.white10,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  tech.toString(),
                                  style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          widget.project['description'] ?? '',
                          maxLines: 5,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(color: Colors.white70, fontSize: 15, height: 1.5),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
