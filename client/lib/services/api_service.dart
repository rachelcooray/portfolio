import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

class ApiService {
  // If we ever decide to use a backend for dynamic features (like sending emails)
  // we can keep the baseUrl. But for data, we use local assets.
  final String baseUrl = 'http://localhost:3000/api'; 

  Future<Map<String, dynamic>> _loadData() async {
    final String response = await rootBundle.loadString('assets/data.json');
    return json.decode(response);
  }

  Future<List<dynamic>> getProjects() async {
    final data = await _loadData();
    return data['projects'];
  }

  Future<List<dynamic>> getExperience() async {
    final data = await _loadData();
    return data['experience'];
  }

  Future<List<dynamic>> getSkills() async {
    final data = await _loadData();
    return data['skills'];
  }

  Future<List<dynamic>> getPublications() async {
     final data = await _loadData();
     return data['publications'];
  }

  Future<List<dynamic>> getVolunteering() async {
     final data = await _loadData();
     return data['volunteering'];
  }

  Future<List<dynamic>> getFeatured() async {
     final data = await _loadData();
     return data['featured'];
  }

  Future<bool> sendContactMessage(String name, String email, String message) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/contact'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'name': name, 'email': email, 'message': message}),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error sending message: $e');
      return false;
    }
  }
}
