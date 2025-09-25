import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MatchReport, CreateReportData } from '../types/report';
import { LocalStorageService } from '../services/localStorage';

interface ReportsContextType {
  reports: MatchReport[];
  currentReport: MatchReport | null;
  loading: boolean;
  error: string | null;
  createReport: (reportData: CreateReportData) => Promise<MatchReport>;
  updateReport: (id: string, reportData: Partial<CreateReportData>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getReportById: (id: string) => Promise<MatchReport | null>;
  loadAllReports: () => Promise<void>;
  setCurrentReport: (report: MatchReport | null) => void;
  clearError: () => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

interface ReportsProviderProps {
  children: ReactNode;
}

export function ReportsProvider({ children }: ReportsProviderProps) {
  const [reports, setReports] = useState<MatchReport[]>([]);
  const [currentReport, setCurrentReport] = useState<MatchReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadAllReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allReports = await LocalStorageService.getAllReports();
      setReports(allReports);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = useCallback(async (reportData: CreateReportData): Promise<MatchReport> => {
    try {
      setLoading(true);
      setError(null);
      const newReport = await LocalStorageService.saveReport(reportData);
      setReports(prev => [...prev, newReport]);
      return newReport;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create report';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReport = useCallback(async (id: string, reportData: Partial<CreateReportData>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedReport = await LocalStorageService.updateReport(id, reportData);
      if (updatedReport) {
        setReports(prev => prev.map(report => 
          report.id === id ? updatedReport : report
        ));
        if (currentReport?.id === id) {
          setCurrentReport(updatedReport);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentReport]);

  const deleteReport = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const success = await LocalStorageService.deleteReport(id);
      if (success) {
        setReports(prev => prev.filter(report => report.id !== id));
        if (currentReport?.id === id) {
          setCurrentReport(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentReport]);

  const getReportById = useCallback(async (id: string): Promise<MatchReport | null> => {
    try {
      const report = await LocalStorageService.getReportById(id);
      if (report) {
        setCurrentReport(report);
      }
      return report;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get report');
      return null;
    }
  }, []);

  const contextValue: ReportsContextType = {
    reports,
    currentReport,
    loading,
    error,
    createReport,
    updateReport,
    deleteReport,
    getReportById,
    loadAllReports,
    setCurrentReport,
    clearError
  };

  return (
    <ReportsContext.Provider value={contextValue}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReportsContext(): ReportsContextType {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReportsContext must be used within a ReportsProvider');
  }
  return context;
}