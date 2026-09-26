import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../services/api_service.dart';
import '../theme/palette.dart';

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
      color: AppColors.surface,
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 100),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 900),
          child: Column(
            children: [
               Text(
                'What\'s Next?',
                style: const TextStyle(
                  color: AppColors.textFaint,
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2,
                ),
              ).animate().fadeIn(duration: 450.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic),
              const SizedBox(height: 10),
              Text(
                'Let’s Build Something Together',
                textAlign: TextAlign.center,
                style: GoogleFonts.fraunces(
                  fontSize: MediaQuery.of(context).size.width < 800 ? 28 : 42,
                  fontWeight: FontWeight.w600,
                  fontStyle: FontStyle.italic,
                  color: AppColors.text,
                ),
              ).animate().fadeIn(delay: 150.ms, duration: 450.ms, curve: Curves.easeInOutCubic).slideY(begin: 0.1, end: 0, curve: Curves.easeInOutCubic),
              const SizedBox(height: 25),
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 600),
                child: const Text(
                  'I am currently looking for new opportunities in Data Science and Fullstack Development. Whether you have a question or just want to say hi, reach out, I’ll get back to you soon!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: AppColors.textMuted,
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
                      style: const TextStyle(color: AppColors.text),
                      decoration: InputDecoration(
                        labelText: 'Name',
                        filled: true,
                        fillColor: AppColors.surfaceAlt,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.divider)),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.accent)),
                      ),
                      validator: (v) => v == null || v.isEmpty ? 'Please enter your name' : null,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _emailController,
                      style: const TextStyle(color: AppColors.text),
                      decoration: InputDecoration(
                        labelText: 'Email',
                        filled: true,
                        fillColor: AppColors.surfaceAlt,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.divider)),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.accent)),
                      ),
                      validator: (v) => v == null || v.isEmpty ? 'Please enter your email' : null,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _messageController,
                      maxLines: 5,
                      style: const TextStyle(color: AppColors.text),
                      decoration: InputDecoration(
                        labelText: 'Message',
                        filled: true,
                        fillColor: AppColors.surfaceAlt,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.divider)),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.accent)),
                      ),
                      validator: (v) => v == null || v.isEmpty ? 'Please enter a message' : null,
                    ),
                    const SizedBox(height: 30),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isSubmitting ? null : _submit,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 18),
                          backgroundColor: AppColors.accent,
                          foregroundColor: AppColors.bg,
                          elevation: 0,
                          shape: const StadiumBorder(),
                        ),
                        child: _isSubmitting
                          ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.bg))
                          : Text('Start a Conversation', style: GoogleFonts.figtree(fontSize: 16, fontWeight: FontWeight.bold)),
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
        foregroundColor: AppColors.text,
        side: const BorderSide(color: AppColors.divider),
        shape: const StadiumBorder(),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
      ),
    );
  }
}
