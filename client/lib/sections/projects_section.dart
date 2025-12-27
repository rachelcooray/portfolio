import 'package:flutter/material.dart';
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
      title: '04. Some Things I\'ve Built',
      subtitle: 'Projects',
      backgroundColor: const Color(0xFF0F172A), // Slightly lighter background
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
            height: 350, // Fixed height for carousel
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: projects.length,
              itemBuilder: (context, index) {
                final project = projects[index];
                return Padding(
                  padding: const EdgeInsets.only(right: 20),
                  child: _ProjectCard(project: project),
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
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: () => _launchUrl(widget.project['link']),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOutCubic,
          width: 300,
          transform: _isHovered ? Matrix4.translationValues(0, -8, 0) : Matrix4.identity(),
          decoration: BoxDecoration(
            color: const Color(0xFF112240),
            borderRadius: BorderRadius.circular(10),
            boxShadow: _isHovered
                ? [
                    BoxShadow(
                        color: const Color(0xFF64FFDA).withOpacity(0.4),
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
          child: Stack(
            children: [
              // Default View: Thumbnail/Icon + Title
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (widget.project['image'] != null)
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.asset(
                          widget.project['image'],
                          height: 180,
                          width: 260,
                          fit: BoxFit.contain,
                          errorBuilder: (context, error, stackTrace) {
                            return Icon(
                              Icons.folder,
                              size: 50,
                              color: _isHovered ? const Color(0xFF64FFDA) : Colors.white70,
                            );
                          },
                        ),
                      )
                    else
                      Icon(
                         Icons.folder,
                        size: 50,
                        color: _isHovered ? const Color(0xFF64FFDA) : Colors.white70,
                      ),
                    const SizedBox(height: 20),
                    Text(
                      widget.project['title'] ?? '',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),

              // Hover View: Details Overlay
              AnimatedOpacity(
                duration: const Duration(milliseconds: 200),
                opacity: _isHovered ? 1.0 : 0.0,
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF112240).withOpacity(0.95), // Dark overlay
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFF64FFDA)),
                  ),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                       Text(
                        widget.project['title'] ?? '',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF64FFDA),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Expanded(
                        child: Text(
                          widget.project['description'] ?? '',
                          style: const TextStyle(color: Colors.white70, fontSize: 13),
                          overflow: TextOverflow.fade,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        runSpacing: 4,
                        children: (widget.project['tech'] as List<dynamic>? ?? []).map<Widget>((tech) {
                          return Text(
                            tech.toString(),
                            style: const TextStyle(
                              color: Color(0xFF64FFDA),
                              fontSize: 12,
                              fontFamily: 'Fira Code',
                            ),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
