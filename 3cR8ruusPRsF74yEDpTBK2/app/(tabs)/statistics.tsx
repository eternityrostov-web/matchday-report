import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReports } from '../../hooks/useReports';
import { MatchReport, FunctionalArea } from '../../types/report';

interface StatisticItem {
  code: string;
  name: string;
  issueCount: number;
  totalReports: number;
  percentage: number;
}

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const { reports, loadAllReports } = useReports();
  const [statistics, setStatistics] = useState<StatisticItem[]>([]);
  const [totalReports, setTotalReports] = useState(0);
  const [totalIssues, setTotalIssues] = useState(0);

  useEffect(() => {
    loadAllReports();
  }, [loadAllReports]);

  useEffect(() => {
    calculateStatistics();
  }, [reports]);

  const calculateStatistics = () => {
    if (!reports || reports.length === 0) {
      setStatistics([]);
      setTotalReports(0);
      setTotalIssues(0);
      return;
    }

    const functionalAreaStats: { [key: string]: { name: string; issueCount: number } } = {};
    let totalIssueCount = 0;

    // Initialize all functional areas
    reports[0]?.functionalAreas.forEach(area => {
      functionalAreaStats[area.code] = {
        name: area.name,
        issueCount: 0
      };
    });

    // Count issues for each functional area
    reports.forEach(report => {
      report.functionalAreas.forEach(area => {
        if (area.status === 'ISSUE') {
          functionalAreaStats[area.code].issueCount++;
          totalIssueCount++;
        }
      });
    });

    // Convert to array and calculate percentages
    const statsArray: StatisticItem[] = Object.entries(functionalAreaStats)
      .map(([code, data]) => ({
        code,
        name: data.name,
        issueCount: data.issueCount,
        totalReports: reports.length,
        percentage: reports.length > 0 ? (data.issueCount / reports.length) * 100 : 0
      }))
      .sort((a, b) => b.issueCount - a.issueCount);

    setStatistics(statsArray);
    setTotalReports(reports.length);
    setTotalIssues(totalIssueCount);
  };

  const getBarWidth = (percentage: number) => {
    const screenWidth = Dimensions.get('window').width;
    const maxBarWidth = screenWidth - 160; // Account for padding and text
    return (percentage / 100) * maxBarWidth;
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 50) return '#ff4444';
    if (percentage >= 25) return '#ff9800';
    if (percentage >= 10) return '#ffb300';
    return '#4caf50';
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <MaterialIcons name="bar-chart" size={32} color="#007AFF" />
        <Text style={styles.title}>Statistics</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{totalReports}</Text>
          <Text style={styles.summaryLabel}>Total Reports</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, styles.issueNumber]}>{totalIssues}</Text>
          <Text style={styles.summaryLabel}>Total Issues</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {totalReports > 0 ? (totalIssues / totalReports).toFixed(1) : '0'}
          </Text>
          <Text style={styles.summaryLabel}>Avg Issues/Report</Text>
        </View>
      </View>

      {/* Statistics List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Issues by Functional Area</Text>
        
        {statistics.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="assessment" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Statistics Available</Text>
            <Text style={styles.emptySubtitle}>
              Create some reports to see statistics
            </Text>
          </View>
        ) : (
          statistics.map((stat) => (
            <View key={stat.code} style={styles.statItem}>
              <View style={styles.statHeader}>
                <View style={styles.statInfo}>
                  <Text style={styles.statCode}>{stat.code}</Text>
                  <Text style={styles.statName}>{stat.name}</Text>
                </View>
                <View style={styles.statNumbers}>
                  <Text style={styles.statCount}>{stat.issueCount}</Text>
                  <Text style={styles.statPercentage}>{stat.percentage.toFixed(1)}%</Text>
                </View>
              </View>
              
              <View style={styles.barContainer}>
                <View style={styles.barBackground}>
                  <View 
                    style={[
                      styles.barFill,
                      {
                        width: getBarWidth(stat.percentage),
                        backgroundColor: getBarColor(stat.percentage)
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Legend */}
      {statistics.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legend</Text>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4caf50' }]} />
              <Text style={styles.legendText}>Low (0-10%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ffb300' }]} />
              <Text style={styles.legendText}>Medium (10-25%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ff9800' }]} />
              <Text style={styles.legendText}>High (25-50%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ff4444' }]} />
              <Text style={styles.legendText}>Critical (50%+)</Text>
            </View>
          </View>
        </View>
      )}

      <View style={{ height: insets.bottom + 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  issueNumber: {
    color: '#ff6b35',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statInfo: {
    flex: 1,
  },
  statCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statNumbers: {
    alignItems: 'flex-end',
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statPercentage: {
    fontSize: 12,
    color: '#666',
  },
  barContainer: {
    marginTop: 8,
  },
  barBackground: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 15,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});