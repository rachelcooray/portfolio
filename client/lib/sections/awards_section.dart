import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import '../widgets/section_container.dart';

class AwardsSection extends StatefulWidget {
  const AwardsSection({super.key});

  @override
  State<AwardsSection> createState() => _AwardsSectionState();
}

class _AwardsSectionState extends State<AwardsSection> {
  final ApiService _apiService = ApiService();
  late Future<List<dynamic>> _awardsFuture;

  @override
  void initState() {
    super.initState();
    _awardsFuture = _apiService.getAwards();
  }

  @override
  Widget build(BuildContext context) {
    return SectionContainer(
      title: '05. Achievements',
      subtitle: 'Awards & Recognition',
      child: FutureBuilder<List<dynamic>>(
        future: _awardsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No awards found.'));
          }

          final awards = snapshot.data!;
          return Column(
            children: awards.map((award) => _AwardItem(award: award)).toList(),
          );
        },
      ),
    );
  }
}

class _AwardItem extends StatelessWidget {
  final dynamic award;

  const _AwardItem({required this.award});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 30),
      child: Container(
        padding: const EdgeInsets.all(25),
        decoration: BoxDecoration(
          color: const Color(0xFF112240),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: Colors.white10),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.emoji_events, color: Theme.of(context).primaryColor, size: 24),
            ),
            const SizedBox(width: 25),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: Text(
                          award['title'] ?? '',
                          style: GoogleFonts.outfit(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      Text(
                        award['year'] ?? '',
                        style: TextStyle(
                          color: Theme.of(context).primaryColor,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'Fira Code',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 5),
                  Text(
                    award['organization'] ?? '',
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 15),
                  Text(
                    award['summary'] ?? '',
                    style: const TextStyle(
                      color: Colors.white60,
                      fontSize: 15,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
