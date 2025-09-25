import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReports } from '../../hooks/useReports';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { reports } = useReports();

  const recentReports = reports.slice(0, 3);
  const problemReports = reports.filter(report => 
    report.functionalAreas.some(area => area.status === 'PROBLEM')
  ).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome</Text>
          <Text style={styles.appName}>Matchday Report</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialIcons name="stadium" size={32} color="#007AFF" />
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialIcons name="description" size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>{reports.length}</Text>
          <Text style={styles.statLabel}>Total Reports</Text>
        </View>
        
        <View style={styles.statCard}>
          <MaterialIcons name="warning" size={24} color="#FF9800" />
          <Text style={styles.statNumber}>{problemReports}</Text>
          <Text style={styles.statLabel}>With Issues</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/create-report')}
        >
          <View style={styles.actionIcon}>
            <MaterialIcons name="add-circle" size={28} color="white" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Create New Report</Text>
            <Text style={styles.actionSubtitle}>
              Complete a match report
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/reports')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
            <MaterialIcons name="list" size={28} color="white" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View Reports</Text>
            <Text style={styles.actionSubtitle}>
              List of all created reports
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Recent Reports */}
      {recentReports.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/reports')}>
              <Text style={styles.seeAllText}>All Reports</Text>
            </TouchableOpacity>
          </View>
          
          {recentReports.map((report) => (
            <TouchableOpacity 
              key={report.id}
              style={styles.recentReportItem}
              onPress={() => router.push({
                pathname: '/report-details',
                params: { id: report.id }
              })}
            >
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>Match #{report.matchInfo.matchNumber}</Text>
                <Text style={styles.reportSubtitle}>
                  {report.matchInfo.homeTeam} vs {report.matchInfo.awayTeam}
                </Text>
                <Text style={styles.reportDate}>
                  {new Date(report.createdAt).toLocaleDateString('en-US')}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Empty State */}
      {reports.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialIcons name="description" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Get Started</Text>
          <Text style={styles.emptySubtitle}>
            Create your first match report
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => router.push('/create-report')}
          >
            <Text style={styles.emptyButtonText}>Create Report</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  headerIcon: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  recentReportItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  reportSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  reportDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});