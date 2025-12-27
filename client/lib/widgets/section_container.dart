import 'package:flutter/material.dart';

class SectionContainer extends StatelessWidget {
  final Widget child;
  final String title;
  final String subtitle;
  final Color backgroundColor;

  const SectionContainer({
      super.key, 
      required this.child, 
      required this.title, 
      required this.subtitle, 
      this.backgroundColor = Colors.transparent
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: backgroundColor,
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 80),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 900),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  color: Theme.of(context).primaryColor,
                  fontSize: 18,
                  fontFamily: 'Fira Code',
                ),
              ),
              const SizedBox(height: 10),
              Text(
                subtitle,
                style: const TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 40),
              child,
            ],
          ),
        ),
      ),
    );
  }
}
