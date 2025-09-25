import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Platform 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CreateReportData, MatchInfo, Attendance, FunctionalArea, ReportPhoto, MatchReport } from '../types/report';
import { FUNCTIONAL_AREAS } from '../constants/reportData';
import { useReports } from '../hooks/useReports';
import PhotoUploader from './PhotoUploader';
import FunctionalAreaItem from './FunctionalAreaItem';

interface EditReportFormProps {
  reportId: string;
}

export default function EditReportForm({ reportId }: EditReportFormProps) {
  const insets = useSafeAreaInsets();
  const { updateReport, getReportById, loading } = useReports();
  const [report, setReport] = useState<MatchReport | null>(null);
  
  const [matchInfo, setMatchInfo] = useState<MatchInfo>({
    matchNumber: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    tournament: '',
    stage: '',
    stadium: '',
    homeTeam: '',
    awayTeam: '',
    finalScore: ''
  });

  const [clientGroups, setClientGroups] = useState<{
    spectators: number;
    vipGuests: number;
    vvipGuests: number;
    mediaRepresentatives: number;
    photographers: number;
  }>({
    spectators: 0,
    vipGuests: 0,
    vvipGuests: 0,
    mediaRepresentatives: 0,
    photographers: 0
  });

  const [venueManagerName, setVenueManagerName] = useState('');
  const [drsCompliance, setDrsCompliance] = useState<{
    isCompliant: boolean;
    comment?: string;
  }>({ isCompliant: true });
  const [generalIssues, setGeneralIssues] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [photos, setPhotos] = useState<ReportPhoto[]>([]);
  
  const [functionalAreas, setFunctionalAreas] = useState<FunctionalArea[]>(
    FUNCTIONAL_AREAS.map(area => ({
      code: area.code,
      name: area.name,
      status: 'OK' as const,
      comment: ''
    }))
  );

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    try {
      const reportData = await getReportById(reportId);
      if (reportData) {
        setReport(reportData);
        setMatchInfo(reportData.matchInfo);
        setClientGroups(reportData.clientGroups || {
          spectators: 0,
          vipGuests: 0,
          vvipGuests: 0,
          mediaRepresentatives: 0,
          photographers: 0
        });
        setVenueManagerName(reportData.matchInfo.venueManagerName || '');
        setDrsCompliance(reportData.drsCompliance || { isCompliant: true });
        setGeneralIssues(reportData.generalIssues);
        setAdditionalComments(reportData.additionalComments);
        setPhotos(reportData.photos);
        setFunctionalAreas(reportData.functionalAreas);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load report');
      router.back();
    }
  };

  const handleStatusChange = (code: string, status: 'OK' | 'PROBLEM') => {
    setFunctionalAreas(prev => 
      prev.map(area => 
        area.code === code 
          ? { ...area, status, comment: status === 'OK' ? '' : area.comment }
          : area
      )
    );
  };

  const handleCommentChange = (code: string, comment: string) => {
    setFunctionalAreas(prev => 
      prev.map(area => 
        area.code === code ? { ...area, comment } : area
      )
    );
  };

  const validateForm = () => {
    if (!matchInfo.matchNumber.trim()) {
      Alert.alert('Error', 'Please enter match number');
      return false;
    }
    if (!matchInfo.finalScore.trim()) {
      Alert.alert('Error', 'Please enter final score');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const reportData: Partial<CreateReportData> = {
        matchInfo: { ...matchInfo, venueManagerName },
        clientGroups,
        drsCompliance,
        generalIssues,
        functionalAreas,
        additionalComments,
        photos
      };

      await updateReport(reportId, reportData);
      
      Alert.alert(
        'Success', 
        'Report updated successfully!',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'Failed to update report'
      );
    }
  };

  if (!report) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Report</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Match Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Match Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Match Number *</Text>
          <TextInput
            style={styles.input}
            value={matchInfo.matchNumber}
            onChangeText={(text) => setMatchInfo(prev => ({ ...prev, matchNumber: text }))}
            placeholder="Enter match number"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={matchInfo.date}
              onChangeText={(text) => setMatchInfo(prev => ({ ...prev, date: text }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              value={matchInfo.time}
              onChangeText={(text) => setMatchInfo(prev => ({ ...prev, time: text }))}
              placeholder="HH:MM"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Tournament</Text>
            <TextInput
              style={styles.input}
              value={matchInfo.tournament}
              onChangeText={(text) => setMatchInfo(prev => ({ ...prev, tournament: text }))}
              placeholder="Enter tournament name"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Stage</Text>
            <TextInput
              style={styles.input}
              value={matchInfo.stage}
              onChangeText={(text) => setMatchInfo(prev => ({ ...prev, stage: text }))}
              placeholder="Enter stage"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Stadium</Text>
          <TextInput
            style={styles.input}
            value={matchInfo.stadium}
            onChangeText={(text) => setMatchInfo(prev => ({ ...prev, stadium: text }))}
            placeholder="Enter stadium name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Home Team</Text>
            <TextInput
              style={styles.input}
              value={matchInfo.homeTeam}
              onChangeText={(text) => setMatchInfo(prev => ({ ...prev, homeTeam: text }))}
              placeholder="Team name"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Away Team</Text>
            <TextInput
              style={styles.input}
              value={matchInfo.awayTeam}
              onChangeText={(text) => setMatchInfo(prev => ({ ...prev, awayTeam: text }))}
              placeholder="Team name"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Final Score *</Text>
          <TextInput
            style={styles.input}
            value={matchInfo.finalScore}
            onChangeText={(text) => setMatchInfo(prev => ({ ...prev, finalScore: text }))}
            placeholder="0:0"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Venue Manager Name</Text>
          <TextInput
            style={styles.input}
            value={venueManagerName}
            onChangeText={setVenueManagerName}
            placeholder="Enter venue manager name"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Client Groups */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Groups</Text>
        
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Spectators</Text>
            <TextInput
              style={styles.input}
              value={clientGroups.spectators.toString()}
              onChangeText={(text) => setClientGroups(prev => ({ 
                ...prev, 
                spectators: parseInt(text) || 0 
              }))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>VIP Guests</Text>
            <TextInput
              style={styles.input}
              value={clientGroups.vipGuests.toString()}
              onChangeText={(text) => setClientGroups(prev => ({ 
                ...prev, 
                vipGuests: parseInt(text) || 0 
              }))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>VVIP Guests</Text>
            <TextInput
              style={styles.input}
              value={clientGroups.vvipGuests.toString()}
              onChangeText={(text) => setClientGroups(prev => ({ 
                ...prev, 
                vvipGuests: parseInt(text) || 0 
              }))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Media</Text>
            <TextInput
              style={styles.input}
              value={clientGroups.mediaRepresentatives.toString()}
              onChangeText={(text) => setClientGroups(prev => ({ 
                ...prev, 
                mediaRepresentatives: parseInt(text) || 0 
              }))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Photographers</Text>
          <TextInput
            style={styles.input}
            value={clientGroups.photographers.toString()}
            onChangeText={(text) => setClientGroups(prev => ({ 
              ...prev, 
              photographers: parseInt(text) || 0 
            }))}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* General Issues */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Venue Manager General Comments</Text>
        <TextInput
          style={styles.textArea}
          value={generalIssues}
          onChangeText={setGeneralIssues}
          placeholder="Describe general comments..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Functional Areas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Functional Areas</Text>
        {functionalAreas.map((area) => (
          <FunctionalAreaItem
            key={area.code}
            area={area}
            onStatusChange={handleStatusChange}
            onCommentChange={handleCommentChange}
          />
        ))}
      </View>

      {/* DRS Compliance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DRS Compliance</Text>
        
        <View style={styles.complianceRow}>
          <TouchableOpacity
            style={[
              styles.complianceButton,
              drsCompliance.isCompliant && styles.complianceButtonActive
            ]}
            onPress={() => setDrsCompliance({ isCompliant: true, comment: '' })}
          >
            <MaterialIcons 
              name="check-circle" 
              size={20} 
              color={drsCompliance.isCompliant ? "#4CAF50" : "#ddd"} 
            />
            <Text style={[
              styles.complianceButtonText,
              drsCompliance.isCompliant && styles.complianceButtonTextActive
            ]}>Compliant</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.complianceButton,
              !drsCompliance.isCompliant && styles.complianceButtonActive
            ]}
            onPress={() => setDrsCompliance(prev => ({ ...prev, isCompliant: false }))}
          >
            <MaterialIcons 
              name="error" 
              size={20} 
              color={!drsCompliance.isCompliant ? "#ff6b35" : "#ddd"} 
            />
            <Text style={[
              styles.complianceButtonText,
              !drsCompliance.isCompliant && styles.complianceButtonTextActive
            ]}>Non-Compliant</Text>
          </TouchableOpacity>
        </View>
        
        {!drsCompliance.isCompliant && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Issue Description</Text>
            <TextInput
              style={styles.textArea}
              value={drsCompliance.comment}
              onChangeText={(text) => setDrsCompliance(prev => ({ ...prev, comment: text }))}
              placeholder="Describe the DRS compliance issue..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        )}
      </View>

      {/* Additional Comments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Comments</Text>
        <TextInput
          style={styles.textArea}
          value={additionalComments}
          onChangeText={setAdditionalComments}
          placeholder="Additional comments..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Photos */}
      <PhotoUploader
        photos={photos}
        onPhotosChange={setPhotos}
        maxPhotos={10}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <MaterialIcons 
          name="save" 
          size={24} 
          color="white" 
          style={styles.buttonIcon}
        />
        <Text style={styles.submitButtonText}>
          {loading ? 'Saving...' : 'Update Report'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: insets.bottom + 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
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
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonIcon: {
    marginRight: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  complianceRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  complianceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  complianceButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  complianceButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  complianceButtonTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
});