import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';

class ContactSection extends StatefulWidget {
  const ContactSection({super.key});

  @override
  State<ContactSection> createState() => _ContactSectionState();
}

class _ContactSectionState extends State<ContactSection> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _messageController = TextEditingController();
  final ApiService _apiService = ApiService();
  
  bool _isSubmitting = false;

  Future<void> _submit() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isSubmitting = true);
      
      final success = await _apiService.sendContactMessage(
        _nameController.text,
        _emailController.text,
        _messageController.text,
      );

      setState(() => _isSubmitting = false);

      if (mounted) {
        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Message sent successfully!')),
          );
          _formKey.currentState!.reset();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to send message. Please try again or check backend.')),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 100),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 900),
          child: Column(
            // crossAxisAlignment: CrossAxisAlignment.center, // Default is center for Column in ConstrainedBox if not stretched
            children: [
               Text(
                '08. What\'s Next?',
                style: TextStyle(
                  color: Theme.of(context).primaryColor,
                  fontFamily: 'Fira Code',
                ),
              ),
              const SizedBox(height: 20),
               Text(
                'Get In Touch',
                style: GoogleFonts.outfit(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 20),
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 600),
                child: const Text(
                  'I am currently looking for new opportunities. Whether you have a question or just want to say hi, I’ll try my best to get back to you!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.white60,
                    height: 1.5,
                  ),
                ),
              ),
              const SizedBox(height: 30),
              
              // Social Links & Resume
              Wrap(
                alignment: WrapAlignment.center,
                spacing: 20,
                runSpacing: 20,
                children: [
                   _SocialButton(
                    icon: Icons.email, 
                    label: "Email Me", 
                    onTap: () => launchUrl(Uri.parse('mailto:rachel.cooray@example.com'))
                  ),
                  _SocialButton(
                    icon: Icons.code, // Placeholder for GitHub
                    label: "GitHub", 
                    onTap: () => launchUrl(Uri.parse('https://github.com/rachelcooray'))
                  ),
                   _SocialButton(
                    icon: Icons.business, // Placeholder for LinkedIn
                    label: "LinkedIn", 
                    onTap: () => launchUrl(Uri.parse('https://www.linkedin.com/in/rachel-cooray-069034235/'))
                  ),
                  ElevatedButton.icon(
                    onPressed: () {
                      // Placeholder for actual resume URL
                      launchUrl(Uri.parse('rachelcooray-cv.pdf'));
                    }, 
                    icon: const Icon(Icons.download), 
                    label: const Text("Download CV"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                      foregroundColor: const Color(0xFF0A192F),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                    )
                  )
                ],
              ),
              
              const SizedBox(height: 50),
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: 'Name',
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => v == null || v.isEmpty ? 'Please enter your name' : null,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => v == null || v.isEmpty ? 'Please enter your email' : null,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _messageController,
                      maxLines: 5,
                      decoration: const InputDecoration(
                        labelText: 'Message',
                        border: OutlineInputBorder(),
                        alignLabelWithHint: true,
                      ),
                      validator: (v) => v == null || v.isEmpty ? 'Please enter a message' : null,
                    ),
                    const SizedBox(height: 30),
                    ElevatedButton(
                      onPressed: _isSubmitting ? null : _submit,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 20),
                        backgroundColor: Colors.transparent,
                        foregroundColor: Theme.of(context).primaryColor,
                        side: BorderSide(color: Theme.of(context).primaryColor),
                      ),
                      child: _isSubmitting 
                        ? const CircularProgressIndicator() 
                        : const Text('Say Hello', style: TextStyle(fontSize: 16)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SocialButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _SocialButton({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: onTap,
      icon: Icon(icon, size: 18),
      label: Text(label),
      style: OutlinedButton.styleFrom(
        foregroundColor: Theme.of(context).primaryColor,
        side: BorderSide(color: Theme.of(context).primaryColor),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
      ),
    );
  }
}
