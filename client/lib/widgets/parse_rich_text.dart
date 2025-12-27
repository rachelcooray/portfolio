import 'package:flutter/material.dart';

class ParseRichText extends StatelessWidget {
  final String text;
  final TextStyle baseStyle;

  const ParseRichText({
    super.key, 
    required this.text, 
    this.baseStyle = const TextStyle(fontSize: 14, color: Colors.white70),
  });

  List<InlineSpan> _parse(BuildContext context) {
    List<InlineSpan> spans = [];
    final RegExp exp = RegExp(r'\*\*(.*?)\*\*');
    int start = 0;

    for (final Match match in exp.allMatches(text)) {
      if (match.start > start) {
        spans.add(TextSpan(text: text.substring(start, match.start)));
      }
      spans.add(TextSpan(
        text: match.group(1),
        style: baseStyle.copyWith(
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

  @override
  Widget build(BuildContext context) {
    return RichText(
      text: TextSpan(
        style: baseStyle,
        children: _parse(context),
      ),
    );
  }
}
