import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockIssues } from '../data/mockData';
import { Issue } from '../types';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Road': return 'car-outline';
    case 'Water': return 'water-outline';
    case 'Garbage': return 'trash-outline';
    case 'Electricity': return 'flash-outline';
    default: return 'alert-circle-outline';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return '#FF6B6B';
    case 'In Progress': return '#4ECDC4';
    case 'Resolved': return '#45B7D1';
    default: return '#95A5A6';
  }
};

const IssueCard = ({ item }: { item: Issue }) => (
  <TouchableOpacity style={styles.issueCard}>
    <View style={styles.issueHeader}>
      <Ionicons name={getCategoryIcon(item.category)} size={24} color="#2C3E50" />
      <View style={styles.issueInfo}>
        <Text style={styles.issueTitle}>{item.title}</Text>
        <Text style={styles.issueCategory}>{item.category}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
    <Text style={styles.issueDescription}>{item.description}</Text>
    <View style={styles.issueFooter}>
      <Text style={styles.issueDate}>{item.createdAt}</Text>
      <View style={styles.upvoteContainer}>
        <Ionicons name="arrow-up" size={16} color="#7F8C8D" />
        <Text style={styles.upvoteText}>{item.upvotes}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={48} color="#BDC3C7" />
          <Text style={styles.mapText}>Map View</Text>
          <Text style={styles.mapSubtext}>Nearby Issues</Text>
        </View>
      </View>
      
      <View style={styles.issuesSection}>
        <Text style={styles.sectionTitle}>Recent Issues</Text>
        <FlatList
          data={mockIssues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <IssueCard item={item} />}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  mapContainer: {
    height: 250,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  issuesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },
  issueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueInfo: {
    flex: 1,
    marginLeft: 12,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  issueCategory: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  issueDescription: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
    marginBottom: 12,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueDate: {
    fontSize: 12,
    color: '#95A5A6',
  },
  upvoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upvoteText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 4,
  },
});