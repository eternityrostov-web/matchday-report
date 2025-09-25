import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MatchReport } from '../types/report';
import { useReports } from '../hooks/useReports';

interface ReportItemProps {
  report: MatchReport;
  onPress: () => void;
}

function ReportItem({ report, onPress }: ReportItemProps) {
  const problemCount = report.functionalAreas.filter(area => area.status === 'PROBLEM').length;
  
  return (
    <TouchableOpacity style={styles.reportItem} onPress={onPress}>
      {/* Football background */}
      <View style={styles.footballBackground}>
        <MaterialIcons name="sports-soccer" size={120} color="rgba(0,122,255,0.05)" />
      </View>
      
      <View style={styles.reportHeader}>
        <Text style={styles.matchNumber}>Match #{report.matchInfo.matchNumber}</Text>
        <Text style={styles.date}>
          {new Date(report.createdAt).toLocaleDateString('en-US')}
        </Text>
      </View>
      
      <Text style={styles.teams}>
        {report.matchInfo.homeTeam} vs {report.matchInfo.awayTeam}
      </Text>
      
      <Text style={styles.stadium}>{report.matchInfo.stadium}</Text>
      
      <View style={styles.reportFooter}>
        <Text style={styles.score}>Score: {report.matchInfo.finalScore}</Text>
        {problemCount > 0 && (
          <View style={styles.problemBadge}>
            <MaterialIcons name="warning" size={16} color="#ff6b35" />
            <Text style={styles.problemText}>{problemCount} issues</Text>
          </View>
        )}
      </View>
      
      <View style={styles.chevron}>
        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
      </View>
    </TouchableOpacity>
  );
}

export default function ReportsList() {
  const insets = useSafeAreaInsets();
  const { reports, loading, loadAllReports } = useReports();

  useEffect(() => {
    loadAllReports();
  }, [loadAllReports]);

  const handleReportPress = (report: MatchReport) => {
    router.push({
      pathname: '/report-details',
      params: { id: report.id }
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="description" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Reports</Text>
      <Text style={styles.emptySubtitle}>
        Create your first report by tapping the "+" button above
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/create-report')}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportItem 
            report={item} 
            onPress={() => handleReportPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadAllReports}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reportItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  footballBackground: {
    position: 'absolute',
    right: -20,
    top: -20,
    zIndex: 0,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    zIndex: 1,
  },
  matchNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  teams: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    zIndex: 1,
  },
  stadium: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    zIndex: 1,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  problemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  problemText: {
    fontSize: 12,
    color: '#ff6b35',
    marginLeft: 4,
    fontWeight: '600',
  },
  chevron: {
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -12,
    zIndex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
});