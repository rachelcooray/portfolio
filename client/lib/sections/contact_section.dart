import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
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
                '09. What\'s Next?',
                style: TextStyle(
                  color: Theme.of(context).primaryColor,
                  fontSize: 14,
                  fontFamily: 'Fira Code',
                  letterSpacing: 2,
                ),
              ).animate().fadeIn(duration: 450.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic),
              const SizedBox(height: 10),
              Text(
                'Let’s Build Something Together',
                style: GoogleFonts.outfit(
                  fontSize: MediaQuery.of(context).size.width < 800 ? 32 : 48,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ).animate().fadeIn(delay: 150.ms, duration: 450.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic),
              const SizedBox(height: 25),
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 600),
                child: const Text(
                  'I am currently looking for new opportunities in Data Science and Fullstack Development. Whether you have a question or just want to say hi, reach out, I’ll get back to you soon!'',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 16,
                    height: 1.6,
                  ),
                ),
              ).animate().fadeIn(delay: 300.ms, duration: 450.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic),
              const SizedBox(height: 50),
              
              // Contact Form
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: 'Name',
                        border: OutlineInputBorder(),
                        focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Color(0xFF64FFDA))),
                      ),
                      validator: (v) => v == null || v.isEmpty ? 'Please enter your name' : null,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        border: OutlineInputBorder(),
                        focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Color(0xFF64FFDA))),
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
                        focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Color(0xFF64FFDA))),
                      ),
                      validator: (v) => v == null || v.isEmpty ? 'Please enter a message' : null,
                    ),
                    const SizedBox(height: 30),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isSubmitting ? null : _submit,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          backgroundColor: Colors.transparent,
                          foregroundColor: Theme.of(context).primaryColor,
                          side: BorderSide(color: Theme.of(context).primaryColor, width: 2),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                        ),
                        child: _isSubmitting 
                          ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2)) 
                          : Text('Start a Conversation', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(delay: 450.ms, duration: 600.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.05, end: 0, curve: Curves.easeInOutCubic),
              
              const SizedBox(height: 60),
              
              // Social Links
              Wrap(
                alignment: WrapAlignment.center,
                spacing: 20,
                runSpacing: 20,
                children: [
                   _SocialButton(
                    icon: Icons.code, 
                    label: "GitHub", 
                    onTap: () => launchUrl(Uri.parse('https://github.com/rachelcooray'))
                  ),
                   _SocialButton(
                    icon: Icons.business, 
                    label: "LinkedIn", 
                    onTap: () => launchUrl(Uri.parse('https://www.linkedin.com/in/rachel-cooray-069034235/'))
                  ),
                  _SocialButton(
                    icon: Icons.download, 
                    label: "Download CV", 
                    onTap: () => launchUrl(Uri.parse('rachelcooray-cv.pdf'))
                  ),
                ],
              ).animate().fadeIn(delay: 600.ms, duration: 450.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic),
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
