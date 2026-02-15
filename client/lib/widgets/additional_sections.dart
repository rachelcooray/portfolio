import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../widgets/section_container.dart';
import 'package:url_launcher/url_launcher.dart';

// --- Publications Section ---
class PublicationsSection extends StatefulWidget {
  const PublicationsSection({super.key});

  @override
  State<PublicationsSection> createState() => _PublicationsSectionState();
}

class _PublicationsSectionState extends State<PublicationsSection> {
  final ApiService _apiService = ApiService();
  List<dynamic> _publications = [];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final pubs = await _apiService.getPublications();
    if (mounted) {
      setState(() => _publications = pubs);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_publications.isEmpty) return const SizedBox.shrink();
    return SectionContainer(
      title: '05. Publications',
      subtitle: 'Research & Papers',
      backgroundColor: const Color(0xFF112240),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: _publications.map((pub) {
          return Card(
            color: Colors.white.withOpacity(0.05),
            margin: const EdgeInsets.only(bottom: 20),
            child: ListTile(
              leading: const Icon(Icons.menu_book, color: Color(0xFF64FFDA), size: 40),
              title: Text(pub['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              subtitle: Text(pub['conference'] ?? '', style: const TextStyle(color: Color(0xFF64FFDA))),
            ),
          );
        }).toList(),
      ),
    );
  }
}

// --- Volunteering Section ---
class VolunteeringSection extends StatefulWidget {
  const VolunteeringSection({super.key});

  @override
  State<VolunteeringSection> createState() => _VolunteeringSectionState();
}

class _VolunteeringSectionState extends State<VolunteeringSection> {
  final ApiService _apiService = ApiService();
  Map<String, dynamic> _volunteering = {};

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final vol = await _apiService.getVolunteering();
    if (mounted) {
      setState(() => _volunteering = vol);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_volunteering.isEmpty) return const SizedBox.shrink();

    final memberships = List<String>.from(_volunteering['memberships'] ?? []);

    return SectionContainer(
      title: '06. Volunteering',
      subtitle: 'Societies & Memberships',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (memberships.isNotEmpty) ...[
            _buildChips(memberships),
          ],
        ],
      ),
    );
  }

  Widget _buildSubHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: Color(0xFF64FFDA),
      ),
    );
  }

  Widget _buildChips(List<String> items) {
    return SizedBox(
      width: double.infinity,
      child: Wrap(
        alignment: WrapAlignment.start,
        spacing: 15,
        runSpacing: 15,
        children: items.map((item) => Chip(
          avatar: const Icon(Icons.volunteer_activism, size: 16, color: Color(0xFF64FFDA)),
          label: Text(item),
          backgroundColor: const Color(0xFF112240),
          labelStyle: const TextStyle(color: Colors.white, fontSize: 13),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          side: BorderSide(color: const Color(0xFF64FFDA).withOpacity(0.2)),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        )).toList(),
      ),
    );
  }
}

// --- Featured Section ---
class FeaturedSection extends StatefulWidget {
  const FeaturedSection({super.key});

  @override
  State<FeaturedSection> createState() => _FeaturedSectionState();
}

class _FeaturedSectionState extends State<FeaturedSection> {
  final ApiService _apiService = ApiService();
  List<dynamic> _featured = [];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final feat = await _apiService.getFeatured();
    if (mounted) {
      setState(() => _featured = feat);
    }
  }

  Future<void> _launchUrl(String? url) async {
    if (url == null) return;
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri)) {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_featured.isEmpty) return const SizedBox.shrink();
    return SectionContainer(
      title: '08. Featured',
      subtitle: 'In The News',
      backgroundColor: const Color(0xFF112240),
      child: SizedBox(
        height: 450,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: _featured.length,
          itemBuilder: (context, index) {
            return Padding(
              padding: const EdgeInsets.only(right: 20),
              child: _FeaturedCard(item: _featured[index], onLaunch: _launchUrl),
            );
          },
        ),
      ),
    );
  }
}

class _FeaturedCard extends StatefulWidget {
  final dynamic item;
  final Function(String?) onLaunch;

  const _FeaturedCard({required this.item, required this.onLaunch});

  @override
  State<_FeaturedCard> createState() => _FeaturedCardState();
}

class _FeaturedCardState extends State<_FeaturedCard> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: () => widget.onLaunch(widget.item['link']),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOutCubic,
          width: 350,
          transform: _isHovered ? Matrix4.translationValues(0, -8, 0) : Matrix4.identity(),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(10),
            border: _isHovered ? Border.all(color: const Color(0xFF64FFDA)) : null,
            boxShadow: _isHovered
                ? [
                    BoxShadow(
                        color: const Color(0xFF64FFDA).withValues(alpha: 0.2),
                        blurRadius: 20,
                        offset: const Offset(0, 10))
                  ]
                : [],
          ),
          child: Stack(
            children: [
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (widget.item['image'] != null)
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.asset(
                          widget.item['image'],
                          height: 230,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return const Icon(Icons.article_outlined, size: 40, color: Color(0xFF64FFDA));
                          },
                        ),
                      )
                    else
                      const Icon(Icons.article_outlined, size: 40, color: Color(0xFF64FFDA)),
                    const SizedBox(height: 20),
                    Text(
                      widget.item['title'] ?? '',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      widget.item['source'] ?? '', 
                      style: const TextStyle(color: Colors.white70, fontSize: 14)
                    ),
                  ],
                ),
              ),
              AnimatedOpacity(
                duration: const Duration(milliseconds: 200),
                opacity: _isHovered ? 1.0 : 0.0,
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF112240).withValues(alpha: 0.95),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        widget.item['title'] ?? '',
                        style: const TextStyle(color: Color(0xFF64FFDA), fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 10),
                      Expanded(
                        child: Text(
                          widget.item['description'] ?? 'Read the full article...',
                          style: const TextStyle(color: Colors.white70),
                          overflow: TextOverflow.fade,
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Row(
                        children: [
                          Text("Read More ", style: TextStyle(color: Color(0xFF64FFDA))),
                          Icon(Icons.arrow_forward, size: 16, color: Color(0xFF64FFDA))
                        ],
                      )
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
