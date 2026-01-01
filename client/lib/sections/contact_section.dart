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
                '09. What\'s Next?',
                style: TextStyle(
                  color: Theme.of(context).primaryColor,
                  fontSize: 14,
                  fontFamily: 'Fira Code',
                  letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 20),
               Text(
                'Let’s Build Something Together',
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  fontSize: MediaQuery.of(context).size.width < 800 ? 36 : 48,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 30),
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 600),
                child: const Text(
                  'Whether you need a scalable web application, a data-driven mobile solution, or deep analytical insights, I’m here to help you turn your vision into reality.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.white60,
                    height: 1.6,
                  ),
                ),
              ),
              const SizedBox(height: 50),
              
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
                    icon: Icons.code,
                    label: "GitHub", 
                    onTap: () => launchUrl(Uri.parse('https://github.com/rachelcooray'))
                  ),
                   _SocialButton(
                    icon: Icons.business,
                    label: "LinkedIn", 
                    onTap: () => launchUrl(Uri.parse('https://www.linkedin.com/in/rachel-cooray-069034235/'))
                  ),
                  ElevatedButton.icon(
                    onPressed: () {
                      launchUrl(Uri.parse('rachelcooray-cv.pdf'));
                    }, 
                    icon: const Icon(Icons.download), 
                    label: const Text("Download CV"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                      foregroundColor: const Color(0xFF0A192F),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    )
                  )
                ],
              ),
              
              const SizedBox(height: 80),
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
                      scrollPadding: const EdgeInsets.only(bottom: 150),
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
                      scrollPadding: const EdgeInsets.only(bottom: 150),
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _messageController,
                      maxLines: 5,
                      decoration: const InputDecoration(
                        labelText: 'Message',
                        hintText: 'Tell me about your project or opportunity...',
                        border: OutlineInputBorder(),
                        focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Color(0xFF64FFDA))),
                        alignLabelWithHint: true,
                      ),
                      validator: (v) => v == null || v.isEmpty ? 'Please enter a message' : null,
                      scrollPadding: const EdgeInsets.only(bottom: 150),
                    ),
                    const SizedBox(height: 40),
                    ElevatedButton(
                      onPressed: _isSubmitting ? null : _submit,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 60, vertical: 25),
                        backgroundColor: Colors.transparent,
                        foregroundColor: Theme.of(context).primaryColor,
                        side: BorderSide(color: Theme.of(context).primaryColor, width: 2),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: _isSubmitting 
                        ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2)) 
                        : const Text('Start a Conversation', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
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
