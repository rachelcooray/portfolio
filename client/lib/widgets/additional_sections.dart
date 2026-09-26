import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import '../widgets/section_container.dart';
import '../theme/palette.dart';
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
      title: 'Publications',
      subtitle: 'Research & Papers',
      backgroundColor: AppColors.surface,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: _publications.map((pub) {
          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surfaceAlt,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.divider),
            ),
            child: Row(
              children: [
                const Icon(Icons.menu_book, color: AppColors.accent, size: 32),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(pub['title'] ?? '', style: GoogleFonts.figtree(fontWeight: FontWeight.bold, color: AppColors.text, fontSize: 15)),
                      const SizedBox(height: 4),
                      Text(pub['conference'] ?? '', style: const TextStyle(color: AppColors.accent, fontSize: 13, fontWeight: FontWeight.w500)),
                    ],
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}

// --- Beyond Work Section (Volunteering + Featured/Press, merged) ---
class BeyondWorkSection extends StatefulWidget {
  const BeyondWorkSection({super.key});

  @override
  State<BeyondWorkSection> createState() => _BeyondWorkSectionState();
}

class _BeyondWorkSectionState extends State<BeyondWorkSection> {
  final ApiService _apiService = ApiService();
  List<dynamic> _volunteerExperience = [];
  List<dynamic> _memberships = [];
  List<dynamic> _featured = [];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final volExp = await _apiService.getVolunteerExperience();
    final memberships = await _apiService.getVolunteering();
    final feat = await _apiService.getFeatured();
    if (mounted) {
      setState(() {
        _volunteerExperience = volExp;
        _memberships = memberships;
        _featured = feat;
      });
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
    if (_volunteerExperience.isEmpty && _memberships.isEmpty && _featured.isEmpty) {
      return const SizedBox.shrink();
    }

    return SectionContainer(
      title: 'Beyond Work',
      subtitle: 'Volunteering & Press',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (_volunteerExperience.isNotEmpty) ...[
            const Text('Volunteering', style: TextStyle(color: AppColors.text, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 15),
            ..._volunteerExperience.map((v) => _VolunteerTile(item: v)),
          ],
          if (_volunteerExperience.isNotEmpty && _memberships.isNotEmpty) const SizedBox(height: 40),
          if (_memberships.isNotEmpty) ...[
            const Text('Memberships', style: TextStyle(color: AppColors.text, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 15),
            Wrap(
              alignment: WrapAlignment.start,
              spacing: 12,
              runSpacing: 12,
              children: _memberships.map((vol) => Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                decoration: BoxDecoration(
                  color: AppColors.surfaceAlt,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.divider),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.group, size: 15, color: AppColors.accent),
                    const SizedBox(width: 8),
                    Text(vol.toString(), style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
                  ],
                ),
              )).toList(),
            ),
          ],
          if ((_volunteerExperience.isNotEmpty || _memberships.isNotEmpty) && _featured.isNotEmpty)
            const SizedBox(height: 50),
          if (_featured.isNotEmpty) ...[
            const Text('In The News', style: TextStyle(color: AppColors.text, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 15),
            SizedBox(
              height: 400,
              width: double.infinity,
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
          ],
        ],
      ),
    );
  }
}

class _VolunteerTile extends StatelessWidget {
  final dynamic item;
  const _VolunteerTile({required this.item});

  @override
  Widget build(BuildContext context) {
    final details = List<String>.from(item['details'] ?? []);
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surfaceAlt,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(item['title'] ?? '', style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.text)),
              ),
              Text('${item['date_range'] ?? ''} · ${item['duration'] ?? ''}', style: const TextStyle(fontSize: 13, color: AppColors.textFaint)),
            ],
          ),
          const SizedBox(height: 4),
          Text(item['organization'] ?? '', style: const TextStyle(fontSize: 14.5, color: AppColors.accent, fontWeight: FontWeight.w600)),
          if ((item['category'] as String?)?.isNotEmpty ?? false) ...[
            const SizedBox(height: 3),
            Text(item['category'], style: const TextStyle(fontSize: 13, color: AppColors.textMuted)),
          ],
          if (details.isNotEmpty) ...[
            const SizedBox(height: 12),
            ...details.map((d) => Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('▹ ', style: TextStyle(color: AppColors.accent, fontSize: 13)),
                      Expanded(child: Text(d, style: const TextStyle(color: AppColors.textMuted, fontSize: 13.5, height: 1.45))),
                    ],
                  ),
                )),
          ],
        ],
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
          width: 320,
          transform: _isHovered ? Matrix4.translationValues(0, -6, 0) : Matrix4.identity(),
          decoration: BoxDecoration(
            color: AppColors.surfaceAlt,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: _isHovered ? AppColors.accent : AppColors.divider),
            boxShadow: [
              BoxShadow(
                  color: Colors.black.withOpacity(_isHovered ? 0.08 : 0.04),
                  blurRadius: _isHovered ? 20 : 10,
                  offset: Offset(0, _isHovered ? 10 : 5))
            ],
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
                        borderRadius: BorderRadius.circular(10),
                        child: Image.asset(
                          widget.item['image'],
                          height: 210,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return const Icon(Icons.article_outlined, size: 40, color: AppColors.accent);
                          },
                        ),
                      )
                    else
                      const Icon(Icons.article_outlined, size: 40, color: AppColors.accent),
                    const SizedBox(height: 18),
                    Text(
                      widget.item['title'] ?? '',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppColors.text,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.item['source'] ?? '',
                      style: const TextStyle(color: AppColors.textFaint, fontSize: 13)
                    ),
                  ],
                ),
              ),
              AnimatedOpacity(
                duration: const Duration(milliseconds: 200),
                opacity: _isHovered ? 1.0 : 0.0,
                child: Container(
                  decoration: BoxDecoration(
                    color: AppColors.surfaceAlt.withOpacity(0.97),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        widget.item['title'] ?? '',
                        style: const TextStyle(color: AppColors.accent, fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      const SizedBox(height: 10),
                      Expanded(
                        child: Text(
                          widget.item['description'] ?? 'Read the full article...',
                          style: const TextStyle(color: AppColors.textMuted),
                          overflow: TextOverflow.fade,
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Row(
                        children: [
                          Text("Read More ", style: TextStyle(color: AppColors.accent, fontWeight: FontWeight.bold)),
                          Icon(Icons.arrow_forward, size: 16, color: AppColors.accent)
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
