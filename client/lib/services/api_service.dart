import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

class ApiService {
  // Use Render URL in production, Localhost in debug
  final String baseUrl = kReleaseMode 
      ? 'https://portfolio-server-mzfs.onrender.com/api' 
      : 'http://localhost:3000/api';

  Future<Map<String, dynamic>> _loadData() async {
    final String response = await rootBundle.loadString('assets/data.json');
    return json.decode(response);
  }

  // Helper to filter items with "visible": false
  List<dynamic> _filterVisible(List<dynamic> list) {
    return list.where((item) {
      if (item is Map && item.containsKey('visible') && item['visible'] == false) {
        return false;
      }
      return true;
    }).toList();
  }

  Future<List<dynamic>> getProjects() async {
    final data = await _loadData();
    return _filterVisible(data['projects']);
  }

  Future<List<dynamic>> getExperience() async {
    final data = await _loadData();
    return _filterVisible(data['experience']);
  }

  Future<List<dynamic>> getSkills() async {
    final data = await _loadData();
    return _filterVisible(data['skills']);
  }

  Future<List<dynamic>> getPublications() async {
     final data = await _loadData();
     return _filterVisible(data['publications']);
  }

  Future<List<dynamic>> getVolunteering() async {
     final data = await _loadData();
     return _filterVisible(data['volunteering']);
  }

  Future<List<dynamic>> getFeatured() async {
     final data = await _loadData();
     return _filterVisible(data['featured']);
  }

  Future<String> getAspirations() async {
     final data = await _loadData();
     return data['aspirations'] ?? '';
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
