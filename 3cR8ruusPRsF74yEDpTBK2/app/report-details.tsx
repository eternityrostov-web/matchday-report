
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as MailComposer from 'expo-mail-composer';

import { MatchReport } from '../types/report';
import { useReports } from '../hooks/useReports';
import { PDFService } from '../services/pdfService';

export default function ReportDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getReportById, deleteReport } = useReports();
  const [report, setReport] = useState<MatchReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (id) {
      loadReport();
    }
  }, [id]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const reportData = await getReportById(id);
      setReport(reportData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load report');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: '/create-report',
      params: { editId: id }
    }); // Added closing brace and parenthesis for handleEdit object and router.push call
    // Add this CSS for hover effect on web
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        .photo-item:hover .photo-overlay {
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReport(id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete report');
            }
          }
        }
      ]
    );
  };

  const openPhotoModal = (index: number) => {
    setCurrentPhotoIndex(index);
    setPhotoModalVisible(true);
  };

  const closePhotoModal = () => {
    setPhotoModalVisible(false);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!report?.photos) return;
    
    const newIndex = direction === 'prev' 
      ? (currentPhotoIndex - 1 + report.photos.length) % report.photos.length
      : (currentPhotoIndex + 1) % report.photos.length;
    
    setCurrentPhotoIndex(newIndex);
  };

  const sendEmail = async () => {
    if (!report) return;
    
    try {
      // Check if mail is available
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Email is not available on this device');
        return;
      }

      // Generate PDF first
      const pdfUri = await PDFService.generatePDF(report);
      
      // Create email content
      const matchDescription = `${report.matchInfo.homeTeam} vs ${report.matchInfo.awayTeam}, Match #${report.matchInfo.matchNumber} (${report.matchInfo.finalScore})`;
      const emailBody = `Dear colleagues,\n\nHope it finds you well.\n\nPlease see below report for "${matchDescription}", which was held at "${report.matchInfo.stadium}"\n\nBest regards`;
      
      const result = await MailComposer.composeAsync({
        subject: `Match Report #${report.matchInfo.matchNumber} - ${report.matchInfo.homeTeam} vs ${report.matchInfo.awayTeam}`,
        body: emailBody,
        attachments: [pdfUri],
      }); // Added closing brace and parenthesis for composeAsync call
      
      if (result.status === MailComposer.MailComposerStatus.SENT) {
        Alert.alert('Success', 'Email sent successfully!');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to send email'
      );
    }
  };

  const generatePDF = async () => {
    if (!report) return;
    
    try {
      const pdfUri = await PDFService.generatePDF(report);
      
      if (Platform.OS === 'web') {
        Alert.alert('PDF', 'PDF opened for printing in new window');
      } else {
        Alert.alert(
          'PDF Created',
          'PDF report created successfully. Would you like to share it?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Share', 
              onPress: () => PDFService.sharePDF(pdfUri)
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create PDF'
      );
    }
  };

  const sendToWhatsApp = async () => {
    if (!report) return;
    
    try {
      const pdfUri = await PDFService.generatePDF(report);
      await PDFService.openWhatsApp(pdfUri, report);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to send to WhatsApp'
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Report not found</Text>
      </View>
    );
  }

  const problemAreas = report?.functionalAreas?.filter(area => area.status === 'ISSUE') || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Report #{report.matchInfo.matchNumber}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleEdit}
          >
            <MaterialIcons name="edit" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Match Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Match Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date & Time:</Text>
            <Text style={styles.infoValue}>{report.matchInfo.date} {report.matchInfo.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tournament:</Text>
            <Text style={styles.infoValue}>{report.matchInfo.tournament || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stage:</Text>
            <Text style={styles.infoValue}>{report.matchInfo.stage || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stadium:</Text>
            <Text style={styles.infoValue}>{report.matchInfo.stadium}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Home Team:</Text>
            <Text style={styles.infoValue}>{report.matchInfo.homeTeam}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Away Team:</Text>
            <Text style={styles.infoValue}>{report.matchInfo.awayTeam}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Score:</Text>
            <Text style={[styles.infoValue, styles.scoreText]}>{report.matchInfo.finalScore}</Text>
          </View>
        </View>

        {/* Client Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Groups</Text>
          <View style={styles.attendanceGrid}>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendanceNumber}>{report.clientGroups?.spectators || 0}</Text>
              <Text style={styles.attendanceLabel}>Spectators</Text>
            </View>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendanceNumber}>{report.clientGroups?.vipGuests || 0}</Text>
              <Text style={styles.attendanceLabel}>VIP Guests</Text>
            </View>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendanceNumber}>{report.clientGroups?.vvipGuests || 0}</Text>
              <Text style={styles.attendanceLabel}>VVIP Guests</Text>
            </View>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendanceNumber}>{report.clientGroups?.mediaRepresentatives || 0}</Text>
              <Text style={styles.attendanceLabel}>Media</Text>
            </View>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendanceNumber}>{report.clientGroups?.photographers || 0}</Text>
              <Text style={styles.attendanceLabel}>Photographers</Text>
            </View>
          </View>
        </View>

        {/* General Issues */}
        {report.generalIssues && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Venue Manager General Comments</Text>
            <Text style={styles.textContent}>{report.generalIssues}</Text>
          </View>
        )}

        {/* Problem Areas */}
        {problemAreas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Issues ({problemAreas.length})</Text>
            {problemAreas.map((area) => (
              <View key={area.code} style={styles.problemArea}>
                <View style={styles.problemHeader}>
                  <MaterialIcons name="warning" size={20} color="#ff6b35" />
                  <Text style={styles.problemCode}>{area.code}</Text>
                  <Text style={styles.problemName}>{area.name}</Text>
                </View>
                {area.comment && (
                  <Text style={styles.problemComment}>{area.comment}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* DRS Compliance */}
        {report.drsCompliance && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DRS Compliance</Text>
            <View style={styles.complianceRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={[
                styles.complianceStatus,
                { color: report.drsCompliance.isCompliant ? '#4CAF50' : '#ff6b35' }
              ]}>
                {report.drsCompliance.isCompliant ? 'Compliant' : 'Non-Compliant'}
              </Text>
            </View>
            {!report.drsCompliance.isCompliant && report.drsCompliance.comment && (
              <View style={styles.complianceCommentSection}>
                <Text style={styles.complianceCommentTitle}>Issue Description:</Text>
                <Text style={styles.textContent}>{report.drsCompliance.comment}</Text>
              </View>
            )}
          </View>
        )}

        {/* Additional Comments */}
        {report.additionalComments && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Comments</Text>
            <Text style={styles.textContent}>{report.additionalComments}</Text>
          </View>
        )}

        {/* Photos */}
        {report.photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos ({report.photos.length})</Text>
            <View style={styles.photosGrid}>
              {report.photos.map((photo, index) => (
                <TouchableOpacity 
                  key={photo.id} 
                  style={styles.photoItem}
                  onPress={() => openPhotoModal(index)}
                >
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.photo}
                    contentFit="cover"
                  />
                  <View style={styles.photoOverlay}>
                    <MaterialIcons name="zoom-in" size={24} color="white" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Venue Manager Info - moved to bottom */}
        {report.matchInfo.venueManagerName && (
          <View style={styles.section}>
            <View style={styles.venueManagerSection}>
              <Text style={styles.venueManagerTitle}>Report prepared by:</Text>
              <Text style={styles.venueManagerName}>{report.matchInfo.venueManagerName}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={sendEmail}>
            <MaterialIcons name="email" size={24} color="white" />
            <Text style={styles.actionButtonText}>Send Email</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={generatePDF}>
            <MaterialIcons name="picture-as-pdf" size={24} color="white" />
            <Text style={styles.actionButtonText}>Generate PDF</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.whatsappButton]} 
            onPress={sendToWhatsApp}
          >
            <MaterialIcons name="share" size={24} color="white" />
            <Text style={styles.actionButtonText}>Send to WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>

      {/* Photo Modal */}
      <Modal
        visible={photoModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={closePhotoModal}
            >
              <MaterialIcons name="close" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {currentPhotoIndex + 1} of {report?.photos.length || 0}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Photo Container */}
          <View style={styles.modalPhotoContainer}>
            {report?.photos && report.photos[currentPhotoIndex] && (
              <Image
                source={{ uri: report.photos[currentPhotoIndex].uri }}
                style={[styles.modalPhoto, { width: screenWidth }]}
                contentFit="contain"
              />
            )}

            {/* Navigation Buttons */}
            {report?.photos && report.photos.length > 1 && (
              <>
                <TouchableOpacity 
                  style={[styles.navButton, styles.prevButton]}
                  onPress={() => navigatePhoto('prev')}
                >
                  <MaterialIcons name="chevron-left" size={36} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.navButton, styles.nextButton]}
                  onPress={() => navigatePhoto('next')}
                >
                  <MaterialIcons name="chevron-right" size={36} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Photo Indicators */}
          {report?.photos && report.photos.length > 1 && (
            <View style={styles.indicatorContainer}>
              {report.photos.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentPhotoIndex && styles.activeIndicator
                  ]}
                  onPress={() => setCurrentPhotoIndex(index)}
                />
              ))}
            </View>
          )}
        </View>
      </Modal>
    </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    padding: 8,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 0,
    padding: 20,
    borderRadius: 8,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  scoreText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  attendanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  attendanceItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  attendanceNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  attendanceLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  textContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  venueManagerSection: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  venueManagerTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  venueManagerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  complianceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  complianceStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  complianceCommentSection: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#fff3e0',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  complianceCommentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  problemArea: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  problemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  problemCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginLeft: 8,
  },
  problemName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  problemComment: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    marginTop: 5,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  photoItem: {
    width: 150,
    height: 150,
    position: 'relative',
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  modalCloseButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalPhotoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalPhoto: {
    height: '80%',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  actionButtons: {
    padding: 20,
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

// Add this CSS for hover effect on web
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    .photo-item:hover .photo-overlay {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}
