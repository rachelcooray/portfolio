import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../widgets/section_container.dart';
import 'package:url_launcher/url_launcher.dart';

class AdditionalSections extends StatefulWidget {
  const AdditionalSections({super.key});

  @override
  State<AdditionalSections> createState() => _AdditionalSectionsState();
}

class _AdditionalSectionsState extends State<AdditionalSections> {
  final ApiService _apiService = ApiService();
  List<dynamic> _publications = [];
  List<dynamic> _volunteering = [];
  List<dynamic> _featured = [];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final pubs = await _apiService.getPublications();
    final vol = await _apiService.getVolunteering();
    final feat = await _apiService.getFeatured();
    if (mounted) {
      setState(() {
        _publications = pubs;
        _volunteering = vol;
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
    return Column(
      children: [
        if (_publications.isNotEmpty)
          SectionContainer(
            title: '05. Publications',
            subtitle: 'Research & Papers',
             backgroundColor: const Color(0xFF112240),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: _publications.map((pub) {
                return Card(
                  color: Colors.white.withValues(alpha: 0.05),
                  margin: const EdgeInsets.only(bottom: 20),
                  child: ListTile(
                    leading: const Icon(Icons.menu_book, color: Color(0xFF64FFDA), size: 40),
                    title: Text(pub['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                    subtitle: Text(pub['conference'] ?? '', style: const TextStyle(color: Color(0xFF64FFDA))),
                  ),
                );
              }).toList(),
            ),
          ),
          
        if (_volunteering.isNotEmpty)
          SectionContainer(
            title: '06. Volunteering',
            subtitle: 'Societies & Memberships',
            child: SizedBox(
              width: double.infinity,
              child: Wrap(
                alignment: WrapAlignment.start,
                spacing: 15,
                runSpacing: 15,
                children: _volunteering.map((vol) => Chip(
                  avatar: const Icon(Icons.group, size: 16, color: Color(0xFF64FFDA)),
                  label: Text(vol.toString()),
                  backgroundColor: const Color(0xFF112240),
                  labelStyle: const TextStyle(color: Colors.white),
                  padding: const EdgeInsets.all(10),
                  side: BorderSide.none,
                )).toList(),
              ),
            ),
          ),

        if (_featured.isNotEmpty)
          SectionContainer(
            title: '07. Featured',
            subtitle: 'In The News',
            backgroundColor: const Color(0xFF112240),
            child: SizedBox(
               height: 450, // Increased height to accommodate taller images
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
          )
      ],
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
               // Default View
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
                          height: 230, // Increased to 230 per user request
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
              
               // Hover Overlay
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
