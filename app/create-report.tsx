import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import CreateReportForm from '../components/CreateReportForm';
import EditReportForm from '../components/EditReportForm';

export default function CreateReportScreen() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  
  if (editId) {
    return <EditReportForm reportId={editId} />;
  }
  
  return <CreateReportForm />;
}