import 'package:flutter/material.dart';
import 'dart:math'; // For Flip Animation
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/section_container.dart';
import '../services/api_service.dart';

class ExperienceSection extends StatelessWidget {
  const ExperienceSection({super.key});

  @override
  Widget build(BuildContext context) {
    return SectionContainer(
      title: '02. Where I’ve Worked & Studied',
      subtitle: 'Experience & Education',
      backgroundColor: const Color(0xFF112240),
      child: FutureBuilder<List<dynamic>>(
        future: ApiService().getExperience(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
             return const Text("Failed to load experience", style: TextStyle(color: Colors.red));
          }

          final allExperience = snapshot.data ?? [];
          
          final industry = allExperience.where((e) => e['type'] == 'industry').toList();
          final other = allExperience.where((e) => e['type'] == 'other').toList();
          final education = allExperience.where((e) => e['type'] == 'education').toList();

          int globalIndex = 0;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
               if (industry.isNotEmpty) ...[
                 _SectionHeader(title: "Industry Experience"),
                 ...industry.map((e) {
                   final tile = _ExperienceTile(
                     title: e['title'],
                     company: e['company'],
                     date: e['date_range'],
                     summary: e['summary'],
                     details: List<String>.from(e['details'] ?? []),
                   ).animate().fadeIn(delay: (400 + (globalIndex * 100)).ms, duration: 600.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic);
                   globalIndex++;
                   return tile;
                 }),
                 const SizedBox(height: 40),
               ],
               
               if (other.isNotEmpty) ...[
                 _SectionHeader(title: "Other Experience"),
                 ...other.map((e) {
                   final tile = _ExperienceTile(
                     title: e['title'],
                     company: e['company'],
                     date: e['date_range'],
                     summary: e['summary'],
                     details: List<String>.from(e['details'] ?? []),
                   ).animate().fadeIn(delay: (400 + (globalIndex * 100)).ms, duration: 600.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic);
                   globalIndex++;
                   return tile;
                 }),
                 const SizedBox(height: 40),
               ],

               if (education.isNotEmpty) ...[
                 _SectionHeader(title: "Education"),
                 ...education.map((e) {
                   final tile = _ExperienceTile(
                     title: e['title'],
                     company: e['company'],
                     date: e['date_range'],
                     summary: e['summary'],
                     details: List<String>.from(e['details'] ?? []),
                   ).animate().fadeIn(delay: (400 + (globalIndex * 100)).ms, duration: 600.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic);
                   globalIndex++;
                   return tile;
                 }),
               ]
            ],
          );
        },
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Theme.of(context).primaryColor,
        ),
      ),
    );
  }
}

class _ExperienceTile extends StatefulWidget {
  final String title;
  final String company;
  final String date;
  final String summary;
  final List<String> details;

  const _ExperienceTile({
      required this.title, 
      required this.company, 
      required this.date, 
      required this.summary,
      this.details = const []
  });

  @override
  State<_ExperienceTile> createState() => _ExperienceTileState();
}

class _ExperienceTileState extends State<_ExperienceTile> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  bool _showFront = true;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this, 
      duration: const Duration(milliseconds: 600)
    );
    _animation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut)
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toggleFlip() {
    if (_showFront) {
      _controller.forward();
    } else {
      _controller.reverse();
    }
    _showFront = !_showFront;
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _toggleFlip,
      child: AnimatedBuilder(
        animation: _animation,
        builder: (context, child) {
          final angle = _animation.value * pi;
          // Determine which side to show based on rotation
          final isBack = _animation.value >= 0.5;
          
          return Transform(
            transform: Matrix4.identity()
              ..setEntry(3, 2, 0.001) // Perspective
              ..rotateY(angle),
            alignment: Alignment.center,
            child: isBack 
                ? Transform(
                    alignment: Alignment.center,
                    transform: Matrix4.identity()..rotateY(pi), // Mirror back side to look correct
                    child: _buildBack(),
                  )
                : _buildFront(),
          );
        },
      ),
    );
  }

  Widget _buildCardBase({required Widget child}) {
    return Container(
      height: 220, 
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 20),
      // Use Stack to achieve the left accent line effect safely
      child: Stack(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFF112240),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: Colors.white.withOpacity(0.1)), // Uniform border
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 5)
                )
              ]
            ),
            child: child,
          ),
          // Left Accent Line
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            child: Container(
              width: 2,
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(10),
                  bottomLeft: Radius.circular(10),
                )
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildFront() {
    return _buildCardBase(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
           Row(
             mainAxisAlignment: MainAxisAlignment.spaceBetween,
             children: [
               Expanded(child: Text(widget.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white))),
               const Icon(Icons.touch_app, color: Colors.white24, size: 20) // Hint interaction
             ],
           ),
           const SizedBox(height: 10),
           Text(widget.company, style: TextStyle(fontSize: 16, color: Theme.of(context).primaryColor)),
           const SizedBox(height: 5),
           Text(widget.date, style: const TextStyle(fontSize: 14, color: Colors.white54, fontFamily: 'Fira Code')),
           const SizedBox(height: 15),
           Text(widget.summary, style: const TextStyle(fontSize: 16, color: Colors.white70, height: 1.4)),
        ],
      ),
    );
  }

  Widget _buildBack() {
    return _buildCardBase(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
             mainAxisAlignment: MainAxisAlignment.spaceBetween,
             children: [
               Text("Key Details", style: TextStyle(color: Theme.of(context).primaryColor, fontWeight: FontWeight.bold)),
               const Icon(Icons.undo, color: Colors.white24, size: 20) 
             ],
           ),
           const SizedBox(height: 10),
           Expanded(
             child: SingleChildScrollView( // Allow scrolling if content exceeds fixed height
               child: Column(
                 children: widget.details.map((detail) => Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("▹ ", style: TextStyle(color: Color(0xFF64FFDA), fontSize: 14)),
                        Expanded(
                          child: RichText(
                            text: TextSpan(
                              style: const TextStyle(color: Colors.white70, height: 1.4, fontSize: 14, fontFamily: 'sans-serif'),
                              children: _parseDetail(detail),
                            ),
                          ),
                        ),
                      ],
                    ),
                  )).toList(),
               ),
             ),
           )
        ],
      )
    );
  }
  List<InlineSpan> _parseDetail(String text) {
    List<InlineSpan> spans = [];
    final RegExp exp = RegExp(r'\*\*(.*?)\*\*');
    int start = 0;

    for (final Match match in exp.allMatches(text)) {
      if (match.start > start) {
        spans.add(TextSpan(text: text.substring(start, match.start)));
      }
      spans.add(TextSpan(
        text: match.group(1),
        style: TextStyle(
          color: Theme.of(context).primaryColor,
          fontWeight: FontWeight.bold,
        ),
      ));
      start = match.end;
    }

    if (start < text.length) {
      spans.add(TextSpan(text: text.substring(start)));
    }
    return spans;
  }
}
