// utils/cloudSync/feedbackService.ts
/**
 * Feedback Service - Anonymous Feedback Upload to Firestore
 *
 * Dieser Service verwaltet User-Feedback:
 * - Anonymous Feedback Upload zu Firestore
 * - Offline Queue mit Retry-Mechanismus
 * - 3-Tier Fallback: Firebase → Offline Queue → Email
 *
 * Features:
 * ✅ Anonymous Support (userId optional)
 * ✅ Offline-First mit Queue
 * ✅ Retry-Logik bei fehlgeschlagenen Uploads
 * ✅ Device/App Metadata Collection
 * ✅ Email Fallback Tracking
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getFirebaseFirestore, getCurrentUser, isFirebaseAvailable } from './firebaseConfig';
import type {
  FirestoreFeedback,
  FeedbackQueueItem,
  FeedbackUploadResult,
  FirestoreTimestamp,
} from './types';

// ===== Constants =====

const FEEDBACK_QUEUE_KEY = '@sudoku/feedback_queue';
const MAX_RETRY_ATTEMPTS = 3;

// ===== Error Types =====

export class FeedbackUploadError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'FeedbackUploadError';
  }
}

// ===== Types for Client Input =====

/**
 * Client Feedback Data (from UI)
 * Simplified interface für UI Components
 */
export interface FeedbackInput {
  rating: 1 | 2 | 3 | 4 | 5;
  category?: 'problem' | 'missing' | 'idea' | 'complicated' | 'other';
  details: string;
  email?: string; // Optional: für Rückantworten
}

// ===== Helper Functions =====

/**
 * Sammelt Device/App Metadata für Feedback
 */
function collectMetadata(): {
  platform: 'android' | 'ios' | 'web';
  appVersion: string;
  deviceInfo: string;
} {
  // Platform
  const platform =
    Platform.OS === 'android' ? 'android' : Platform.OS === 'ios' ? 'ios' : 'web';

  // App Version (from app.json via expo-constants)
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  // Device Info
  const osVersion = Platform.Version;
  const deviceInfo = `${Platform.OS} ${osVersion}`;

  return {
    platform,
    appVersion,
    deviceInfo,
  };
}

/**
 * Generiert eine UUID v4 für Queue Items
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ===== Firestore Upload =====

/**
 * Upload Feedback direkt zu Firestore (Collection: feedback)
 *
 * @param input Feedback Input vom User
 * @param sentViaEmail true wenn Email-Fallback bereits verwendet wurde
 * @returns Upload Result mit Document ID
 */
export async function uploadFeedbackToFirestore(
  input: FeedbackInput,
  sentViaEmail: boolean = false
): Promise<FeedbackUploadResult> {
  try {
    console.log('[FeedbackService] Uploading feedback to Firestore...');

    // Check Firebase availability
    if (!isFirebaseAvailable()) {
      console.warn('[FeedbackService] Firebase not available');
      throw new FeedbackUploadError(
        'Firebase not available',
        'FIREBASE_UNAVAILABLE'
      );
    }

    // Collect metadata
    const metadata = collectMetadata();

    // Get current user (optional - kann null sein für anonymous)
    const currentUser = getCurrentUser();
    const userId = currentUser?.uid || null;
    const userEmail = input.email || currentUser?.email || null;

    // Create Firestore document
    const feedbackDoc: FirestoreFeedback = {
      // User Info (optional)
      userId,
      userEmail,

      // Feedback Data
      rating: input.rating,
      category: input.category,
      details: input.details,

      // Device/App Info
      platform: metadata.platform,
      appVersion: metadata.appVersion,
      deviceInfo: metadata.deviceInfo,

      // Metadata
      createdAt: Date.now() as FirestoreTimestamp,
      status: 'new',

      // Email Fallback Info
      sentViaEmail,
      emailSentAt: sentViaEmail ? (Date.now() as FirestoreTimestamp) : undefined,
    };

    // Upload to Firestore
    const firestore = getFirebaseFirestore();
    const docRef = await firestore.collection('feedback').add(feedbackDoc);

    console.log('[FeedbackService] ✅ Feedback uploaded successfully:', docRef.id);

    return {
      success: true,
      feedbackId: docRef.id,
      sentViaEmail,
    };
  } catch (error: any) {
    console.error('[FeedbackService] ❌ Error uploading feedback:', error);

    // Return structured error
    throw new FeedbackUploadError(
      'Failed to upload feedback to Firestore',
      error.code || 'UNKNOWN_ERROR',
      error
    );
  }
}

// ===== Offline Queue Management =====

/**
 * Lade die Feedback Queue aus AsyncStorage
 */
async function loadFeedbackQueue(): Promise<FeedbackQueueItem[]> {
  try {
    const queueJson = await AsyncStorage.getItem(FEEDBACK_QUEUE_KEY);
    return queueJson ? JSON.parse(queueJson) : [];
  } catch (error) {
    console.error('[FeedbackService] Error loading feedback queue:', error);
    return [];
  }
}

/**
 * Speichere die Feedback Queue in AsyncStorage
 */
async function saveFeedbackQueue(queue: FeedbackQueueItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FEEDBACK_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('[FeedbackService] Error saving feedback queue:', error);
  }
}

/**
 * Füge Feedback zur Offline Queue hinzu
 *
 * @param input Feedback Input vom User
 * @param sentViaEmail true wenn Email-Fallback bereits verwendet wurde
 */
export async function addToOfflineQueue(
  input: FeedbackInput,
  sentViaEmail: boolean = false
): Promise<void> {
  try {
    console.log('[FeedbackService] Adding feedback to offline queue...');

    // Collect metadata
    const metadata = collectMetadata();

    // Get current user (optional)
    const currentUser = getCurrentUser();
    const userId = currentUser?.uid || null;
    const userEmail = input.email || currentUser?.email || null;

    // Create queue item
    const queueItem: FeedbackQueueItem = {
      id: generateUUID(),
      feedback: {
        // User Info
        userId,
        userEmail,

        // Feedback Data
        rating: input.rating,
        category: input.category,
        details: input.details,

        // Device/App Info
        platform: metadata.platform,
        appVersion: metadata.appVersion,
        deviceInfo: metadata.deviceInfo,

        // Email Fallback Info
        sentViaEmail,
        emailSentAt: sentViaEmail ? (Date.now() as FirestoreTimestamp) : undefined,
      },
      attempts: 0,
      lastAttemptAt: null,
      createdAt: Date.now() as FirestoreTimestamp,
      status: 'pending',
    };

    // Add to queue
    const queue = await loadFeedbackQueue();
    queue.push(queueItem);
    await saveFeedbackQueue(queue);

    console.log('[FeedbackService] ✅ Feedback added to offline queue:', queueItem.id);
  } catch (error) {
    console.error('[FeedbackService] ❌ Error adding to offline queue:', error);
    throw error;
  }
}

/**
 * Verarbeite die Offline Queue - versuche alle pending Feedbacks hochzuladen
 *
 * Sollte aufgerufen werden:
 * - Bei App-Start
 * - Nach erfolgreicher Netzwerkverbindung
 * - Nach erfolgreicher Firebase-Authentifizierung
 *
 * @returns Anzahl der erfolgreich hochgeladenen Feedbacks
 */
export async function processOfflineQueue(): Promise<number> {
  try {
    console.log('[FeedbackService] Processing offline queue...');

    // Check Firebase availability
    if (!isFirebaseAvailable()) {
      console.warn('[FeedbackService] Firebase not available - skipping queue processing');
      return 0;
    }

    const queue = await loadFeedbackQueue();
    if (queue.length === 0) {
      console.log('[FeedbackService] Offline queue is empty');
      return 0;
    }

    console.log(`[FeedbackService] Found ${queue.length} items in queue`);

    let successCount = 0;
    const updatedQueue: FeedbackQueueItem[] = [];

    for (const item of queue) {
      // Skip already uploaded items
      if (item.status === 'uploaded') {
        console.log(`[FeedbackService] Skipping already uploaded item: ${item.id}`);
        continue;
      }

      // Skip items that exceeded max retries
      if (item.attempts >= MAX_RETRY_ATTEMPTS) {
        console.warn(
          `[FeedbackService] Item ${item.id} exceeded max retries (${MAX_RETRY_ATTEMPTS})`
        );
        item.status = 'failed';
        updatedQueue.push(item);
        continue;
      }

      // Try to upload
      try {
        console.log(`[FeedbackService] Attempting to upload item ${item.id} (attempt ${item.attempts + 1})`);

        item.status = 'uploading';
        item.attempts += 1;
        item.lastAttemptAt = Date.now() as FirestoreTimestamp;

        // Create Firestore document
        const feedbackDoc: FirestoreFeedback = {
          ...item.feedback,
          createdAt: item.createdAt, // Use original creation time
          status: 'new',
        };

        // Upload to Firestore
        const firestore = getFirebaseFirestore();
        const docRef = await firestore.collection('feedback').add(feedbackDoc);

        console.log(`[FeedbackService] ✅ Item ${item.id} uploaded successfully: ${docRef.id}`);

        item.status = 'uploaded';
        successCount++;

        // Don't add to updated queue (remove from queue)
      } catch (error: any) {
        console.error(`[FeedbackService] ❌ Failed to upload item ${item.id}:`, error);

        item.status = 'pending';
        updatedQueue.push(item);
      }
    }

    // Save updated queue (nur noch failed/pending items)
    await saveFeedbackQueue(updatedQueue);

    console.log(`[FeedbackService] Queue processing completed: ${successCount} uploaded, ${updatedQueue.length} remaining`);

    return successCount;
  } catch (error) {
    console.error('[FeedbackService] ❌ Error processing offline queue:', error);
    return 0;
  }
}

/**
 * Lösche die komplette Offline Queue (z.B. nach Datenlöschung)
 */
export async function clearOfflineQueue(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FEEDBACK_QUEUE_KEY);
    console.log('[FeedbackService] Offline queue cleared');
  } catch (error) {
    console.error('[FeedbackService] Error clearing offline queue:', error);
  }
}

/**
 * Gibt die Anzahl der pending Items in der Queue zurück
 */
export async function getQueueItemCount(): Promise<number> {
  try {
    const queue = await loadFeedbackQueue();
    return queue.filter((item) => item.status === 'pending' || item.status === 'uploading').length;
  } catch (error) {
    console.error('[FeedbackService] Error getting queue count:', error);
    return 0;
  }
}

// ===== Main Feedback Submission Function =====

/**
 * Submit Feedback - 3-Tier Fallback Strategy
 *
 * Strategie:
 * 1. Versuche direkten Upload zu Firestore
 * 2. Falls offline/fehlgeschlagen: Füge zur Queue hinzu
 * 3. Email Fallback wird vom Caller gehandhabt (ReviewManager)
 *
 * @param input Feedback Input vom User
 * @param sentViaEmail true wenn Email-Fallback bereits verwendet wurde
 * @returns Upload Result
 */
export async function submitFeedback(
  input: FeedbackInput,
  sentViaEmail: boolean = false
): Promise<FeedbackUploadResult> {
  try {
    // Try direct upload
    const result = await uploadFeedbackToFirestore(input, sentViaEmail);
    return result;
  } catch (error: any) {
    console.warn('[FeedbackService] Direct upload failed, adding to offline queue:', error.message);

    // Add to offline queue
    try {
      await addToOfflineQueue(input, sentViaEmail);

      return {
        success: true, // Queue success
        sentViaEmail,
        error: error,
      };
    } catch (queueError: any) {
      console.error('[FeedbackService] ❌ Failed to add to offline queue:', queueError);

      return {
        success: false,
        error: queueError,
        sentViaEmail,
      };
    }
  }
}

// ===== Export All =====

export default {
  submitFeedback,
  uploadFeedbackToFirestore,
  addToOfflineQueue,
  processOfflineQueue,
  clearOfflineQueue,
  getQueueItemCount,
};
