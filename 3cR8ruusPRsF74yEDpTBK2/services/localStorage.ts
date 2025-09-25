import AsyncStorage from '@react-native-async-storage/async-storage';
import { MatchReport, CreateReportData } from '../types/report';

const REPORTS_KEY = 'venue_reports';

export class LocalStorageService {
  static async saveReport(reportData: CreateReportData): Promise<MatchReport> {
    try {
      const reports = await this.getAllReports();
      const newReport: MatchReport = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...reportData
      };
      
      const updatedReports = [...reports, newReport];
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(updatedReports));
      
      return newReport;
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  }

  static async getAllReports(): Promise<MatchReport[]> {
    try {
      const reportsJson = await AsyncStorage.getItem(REPORTS_KEY);
      return reportsJson ? JSON.parse(reportsJson) : [];
    } catch (error) {
      console.error('Error getting reports:', error);
      return [];
    }
  }

  static async getReportById(id: string): Promise<MatchReport | null> {
    try {
      const reports = await this.getAllReports();
      return reports.find(report => report.id === id) || null;
    } catch (error) {
      console.error('Error getting report by id:', error);
      return null;
    }
  }

  static async updateReport(id: string, reportData: Partial<CreateReportData>): Promise<MatchReport | null> {
    try {
      const reports = await this.getAllReports();
      const reportIndex = reports.findIndex(report => report.id === id);
      
      if (reportIndex === -1) {
        return null;
      }
      
      const updatedReport: MatchReport = {
        ...reports[reportIndex],
        ...reportData,
        updatedAt: new Date().toISOString()
      };
      
      reports[reportIndex] = updatedReport;
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
      
      return updatedReport;
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }

  static async deleteReport(id: string): Promise<boolean> {
    try {
      const reports = await this.getAllReports();
      const filteredReports = reports.filter(report => report.id !== id);
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(filteredReports));
      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      return false;
    }
  }

  static async clearAllReports(): Promise<void> {
    try {
      await AsyncStorage.removeItem(REPORTS_KEY);
    } catch (error) {
      console.error('Error clearing reports:', error);
      throw error;
    }
  }
}