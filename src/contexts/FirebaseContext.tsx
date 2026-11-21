import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import type {
  AchievementRecord,
  BookmarkRecord,
  ChatMessage,
  DeadlineRecord,
  LanguageCode,
  LearningProgressRecord,
  RoadmapPathway,
  SavedConversationRecord,
  SavedRoadmapRecord,
  StudentProfileData,
} from '../types/domain';

interface FirebaseContextValue {
  user: User | null;
  userDisplayName: string;
  authReady: boolean;
  signingIn: boolean;
  authError: string | null;
  clearAuthError: () => void;
  preferredLanguage: LanguageCode;
  setPreferredLanguage: (lang: LanguageCode) => Promise<void>;
  studentProfile: StudentProfileData | null;
  bookmarks: BookmarkRecord[];
  deadlines: DeadlineRecord[];
  achievements: AchievementRecord[];
  roadmaps: SavedRoadmapRecord[];
  conversations: SavedConversationRecord[];
  learningProgress: LearningProgressRecord[];
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (fullName: string, email: string, password: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  saveStudentProfile: (profile: StudentProfileData) => Promise<void>;
  toggleBookmark: (item: {
    itemType: 'guide' | 'opportunity' | 'university' | 'journey';
    itemId: string;
    title: string;
    category?: string;
  }) => Promise<boolean>;
  isBookmarked: (itemType: string, itemId: string) => boolean;
  addDeadline: (input: {
    title: string;
    category?: string;
    dueDate: string;
    officialUrl?: string;
    notes?: string;
  }) => Promise<void>;
  updateDeadlineStatus: (id: string, status: 'watching' | 'in_progress' | 'submitted') => Promise<void>;
  deleteDeadline: (id: string) => Promise<void>;
  addAchievement: (input: Omit<AchievementRecord, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
  saveRoadmap: (input: {
    title: string;
    educationStage: string;
    summary: string;
    pathways: RoadmapPathway[];
    selectedPathwayId?: string;
  }) => Promise<string | null>;
  toggleRoadmapMilestone: (roadmapId: string, milestoneKey: string) => Promise<void>;
  deleteRoadmap: (roadmapId: string) => Promise<void>;
  saveConversation: (input: {
    id?: string;
    title: string;
    language: LanguageCode;
    noStupidMode: boolean;
    messages: ChatMessage[];
  }) => Promise<string | null>;
  deleteConversation: (id: string) => Promise<void>;
  updateLearningProgress: (input: {
    itemType: 'guide' | 'journey';
    itemId: string;
    title: string;
    completedSteps: string[];
    percentComplete: number;
  }) => Promise<void>;
  exportAllUserData: () => string;
  clearAllAiHistory: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

const LANG_STORAGE_KEY = 'agla_kadam_lang';

function readStoredLanguage(): LanguageCode {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(LANG_STORAGE_KEY) : null;
    if (raw === 'en' || raw === 'te' || raw === 'hi') return raw;
  } catch {
    // ignore storage access restrictions
  }
  return 'en';
}

function writeStoredLanguage(lang: LanguageCode) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
  } catch {
    // ignore storage access restrictions
  }
}

function isSupportedLanguage(val: unknown): val is LanguageCode {
  return val === 'en' || val === 'te' || val === 'hi';
}

function sanitizeId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 110);
  return cleaned || `item_${Date.now()}`;
}

function mapFirebaseAuthError(err: unknown): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code?: unknown }).code || '')
      : '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email address or password. Please check your details and try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Try signing in instead.';
    case 'auth/weak-password':
      return 'Please choose a stronger password (at least 6 characters; 8+ recommended).';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes before trying again or reset your password.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in window. Please allow pop-ups for this site and try again.';
    case 'auth/network-request-failed':
      return 'Network error while connecting to authentication service. Check your connection and retry.';
    case 'auth/operation-not-allowed':
      return 'Email & Password sign-in is not yet enabled in the Firebase Console for this project. Use Continue with Google right now, or enable Email/Password under Authentication → Sign-in method.';
    default:
      return err instanceof Error ? err.message : 'Authentication could not be completed. Please try again.';
  }
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [authReady, setAuthReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguageState] = useState<LanguageCode>(() => readStoredLanguage());
  const [studentProfile, setStudentProfile] = useState<StudentProfileData | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineRecord[]>([]);
  const [achievements, setAchievements] = useState<AchievementRecord[]>([]);
  const [roadmaps, setRoadmaps] = useState<SavedRoadmapRecord[]>([]);
  const [conversations, setConversations] = useState<SavedConversationRecord[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgressRecord[]>([]);

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = preferredLanguage;
    }
    writeStoredLanguage(preferredLanguage);
  }, [preferredLanguage]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      if (currentUser) {
        const fallbackName = (currentUser.displayName || currentUser.email?.split('@')[0] || 'Student').slice(0, 120);
        setUserDisplayName(fallbackName);
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            const initialLang = readStoredLanguage();
            await setDoc(userRef, {
              uid: currentUser.uid,
              displayName: fallbackName,
              email: (currentUser.email || 'student@example.com').slice(0, 200),
              role: 'student',
              preferredLanguage: initialLang,
              currentStage: 'exploring',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } else {
            const data = snap.data();
            if (typeof data?.displayName === 'string' && data.displayName.trim()) {
              setUserDisplayName(data.displayName.trim());
            }
            if (isSupportedLanguage(data?.preferredLanguage)) {
              setPreferredLanguageState(data.preferredLanguage);
              writeStoredLanguage(data.preferredLanguage);
            }
          }
        } catch (err) {
          console.error('User account bootstrap error:', err);
        }
      } else {
        setUserDisplayName('');
        setStudentProfile(null);
        setBookmarks([]);
        setDeadlines([]);
        setAchievements([]);
        setRoadmaps([]);
        setConversations([]);
        setLearningProgress([]);
      }
    });
    return () => unsub();
  }, []);

  // Attach real-time Firestore listeners ONLY when auth is ready and user is authenticated
  useEffect(() => {
    if (!authReady || !user) return;
    const uid = user.uid;

    const unsubs: (() => void)[] = [];

    // Student Profile
    const profilePath = `users/${uid}/profile/student`;
    unsubs.push(
      onSnapshot(
        doc(db, 'users', uid, 'profile', 'student'),
        (snap) => {
          if (snap.exists()) {
            const d = snap.data();
            setStudentProfile({
              educationLevel: d.educationLevel || '',
              stream: d.stream || '',
              location: d.location || '',
              preferredLocation: d.preferredLocation || '',
              budgetRange: d.budgetRange || '',
              interests: Array.isArray(d.interests) ? d.interests : [],
              strengths: Array.isArray(d.strengths) ? d.strengths : [],
              goals: Array.isArray(d.goals) ? d.goals : [],
              trackPreferences: Array.isArray(d.trackPreferences) ? d.trackPreferences : [],
            });
          }
        },
        (err) => handleFirestoreError(err, OperationType.GET, profilePath)
      )
    );

    // Bookmarks
    const bookmarksPath = `users/${uid}/bookmarks`;
    unsubs.push(
      onSnapshot(
        query(collection(db, 'users', uid, 'bookmarks'), where('userId', '==', uid)),
        (snap) => {
          setBookmarks(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BookmarkRecord, 'id'>) })));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, bookmarksPath)
      )
    );

    // Deadlines
    const deadlinesPath = `users/${uid}/deadlines`;
    unsubs.push(
      onSnapshot(
        query(collection(db, 'users', uid, 'deadlines'), where('userId', '==', uid)),
        (snap) => {
          const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DeadlineRecord, 'id'>) }));
          list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
          setDeadlines(list);
        },
        (err) => handleFirestoreError(err, OperationType.LIST, deadlinesPath)
      )
    );

    // Achievements
    const achievementsPath = `users/${uid}/achievements`;
    unsubs.push(
      onSnapshot(
        query(collection(db, 'users', uid, 'achievements'), where('userId', '==', uid)),
        (snap) => {
          const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AchievementRecord, 'id'>) }));
          list.sort((a, b) => b.dateEarned.localeCompare(a.dateEarned));
          setAchievements(list);
        },
        (err) => handleFirestoreError(err, OperationType.LIST, achievementsPath)
      )
    );

    // Roadmaps
    const roadmapsPath = `users/${uid}/roadmaps`;
    unsubs.push(
      onSnapshot(
        query(collection(db, 'users', uid, 'roadmaps'), where('userId', '==', uid)),
        (snap) => {
          setRoadmaps(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SavedRoadmapRecord, 'id'>) })));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, roadmapsPath)
      )
    );

    // AI Conversations
    const convPath = `users/${uid}/aiConversations`;
    unsubs.push(
      onSnapshot(
        query(collection(db, 'users', uid, 'aiConversations'), where('userId', '==', uid)),
        (snap) => {
          setConversations(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SavedConversationRecord, 'id'>) })));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, convPath)
      )
    );

    // Learning Progress
    const progressPath = `users/${uid}/learningProgress`;
    unsubs.push(
      onSnapshot(
        query(collection(db, 'users', uid, 'learningProgress'), where('userId', '==', uid)),
        (snap) => {
          setLearningProgress(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<LearningProgressRecord, 'id'>) })));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, progressPath)
      )
    );

    return () => unsubs.forEach((fn) => fn());
  }, [authReady, user]);

  const signInWithGoogle = async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code || '')
          : '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setAuthError(mapFirebaseAuthError(err));
      }
    } finally {
      setSigningIn(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    setSigningIn(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return true;
    } catch (err) {
      setAuthError(mapFirebaseAuthError(err));
      return false;
    } finally {
      setSigningIn(false);
    }
  };

  const signUpWithEmail = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setSigningIn(true);
    setAuthError(null);
    const cleanedName = fullName.trim().slice(0, 120);
    const cleanedEmail = email.trim().slice(0, 200);
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanedEmail, password);
      if (cleanedName) {
        await updateProfile(cred.user, { displayName: cleanedName });
        setUserDisplayName(cleanedName);
      }
      // Ensure user account doc captures exact Full Name immediately
      const userRef = doc(db, 'users', cred.user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: cred.user.uid,
          displayName: cleanedName || 'Student',
          email: cleanedEmail,
          role: 'student',
          preferredLanguage: readStoredLanguage(),
          currentStage: 'exploring',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else if (cleanedName) {
        await updateDoc(userRef, {
          displayName: cleanedName,
          updatedAt: serverTimestamp(),
        });
      }
      return true;
    } catch (err) {
      setAuthError(mapFirebaseAuthError(err));
      return false;
    } finally {
      setSigningIn(false);
    }
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    setSigningIn(true);
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code || '')
          : '';
      // Avoid enumerating whether an email exists on standard user-not-found
      if (code === 'auth/user-not-found') {
        return true;
      }
      setAuthError(mapFirebaseAuthError(err));
      return false;
    } finally {
      setSigningIn(false);
    }
  };

  const signOut = async () => {
    setAuthError(null);
    await firebaseSignOut(auth);
  };

  const setPreferredLanguage = async (lang: LanguageCode) => {
    setPreferredLanguageState(lang);
    writeStoredLanguage(lang);
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        preferredLanguage: lang,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const saveStudentProfile = async (profile: StudentProfileData) => {
    setStudentProfile(profile);
    if (!user) return;
    const path = `users/${user.uid}/profile/student`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'profile', 'student'), {
        userId: user.uid,
        educationLevel: profile.educationLevel.slice(0, 80) || 'Student',
        stream: profile.stream.slice(0, 80) || 'General',
        location: profile.location.slice(0, 120),
        preferredLocation: profile.preferredLocation.slice(0, 120),
        budgetRange: profile.budgetRange.slice(0, 80),
        interests: profile.interests.slice(0, 20),
        strengths: profile.strengths.slice(0, 20),
        goals: profile.goals.slice(0, 20),
        trackPreferences: profile.trackPreferences.slice(0, 10),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const isBookmarked = (itemType: string, itemId: string) =>
    bookmarks.some((b) => b.itemType === itemType && b.itemId === itemId);

  const toggleBookmark = async (item: {
    itemType: 'guide' | 'opportunity' | 'university' | 'journey';
    itemId: string;
    title: string;
    category?: string;
  }) => {
    if (!user) {
      await signInWithGoogle();
      return false;
    }
    const docId = sanitizeId(`${item.itemType}_${item.itemId}`);
    const ref = doc(db, 'users', user.uid, 'bookmarks', docId);
    const path = `users/${user.uid}/bookmarks/${docId}`;
    const exists = bookmarks.some((b) => b.id === docId);
    try {
      if (exists) {
        await deleteDoc(ref);
        return false;
      }
      await setDoc(ref, {
        userId: user.uid,
        itemType: item.itemType,
        itemId: sanitizeId(item.itemId),
        title: item.title.slice(0, 200),
        category: (item.category || '').slice(0, 100),
        notes: '',
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      handleFirestoreError(err, exists ? OperationType.DELETE : OperationType.CREATE, path);
    }
  };

  const addDeadline = async (input: {
    title: string;
    category?: string;
    dueDate: string;
    officialUrl?: string;
    notes?: string;
  }) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    const id = sanitizeId(`dl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);
    const path = `users/${user.uid}/deadlines/${id}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'deadlines', id), {
        userId: user.uid,
        title: input.title.slice(0, 200),
        category: (input.category || 'Opportunity').slice(0, 80),
        dueDate: input.dueDate.slice(0, 32),
        status: 'watching',
        officialUrl: (input.officialUrl || '').slice(0, 500),
        notes: (input.notes || '').slice(0, 500),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateDeadlineStatus = async (id: string, status: 'watching' | 'in_progress' | 'submitted') => {
    if (!user) return;
    const path = `users/${user.uid}/deadlines/${id}`;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'deadlines', id), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteDeadline = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/deadlines/${id}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'deadlines', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const addAchievement = async (input: Omit<AchievementRecord, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    const id = sanitizeId(`ach_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);
    const path = `users/${user.uid}/achievements/${id}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'achievements', id), {
        userId: user.uid,
        title: input.title.slice(0, 180),
        category: input.category,
        issuer: input.issuer.slice(0, 160),
        dateEarned: input.dateEarned.slice(0, 32),
        verificationUrl: (input.verificationUrl || '').slice(0, 500),
        reflection: (input.reflection || '').slice(0, 600),
        skills: (input.skills || []).slice(0, 15),
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const deleteAchievement = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/achievements/${id}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'achievements', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const saveRoadmap = async (input: {
    title: string;
    educationStage: string;
    summary: string;
    pathways: RoadmapPathway[];
    selectedPathwayId?: string;
  }) => {
    if (!user) {
      await signInWithGoogle();
      return null;
    }
    const id = sanitizeId(`rm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);
    const path = `users/${user.uid}/roadmaps/${id}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'roadmaps', id), {
        userId: user.uid,
        title: input.title.slice(0, 160),
        educationStage: input.educationStage.slice(0, 80),
        summary: input.summary.slice(0, 600),
        pathways: input.pathways.slice(0, 5),
        selectedPathwayId: (input.selectedPathwayId || input.pathways[0]?.id || '').slice(0, 80),
        completedMilestones: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const toggleRoadmapMilestone = async (roadmapId: string, milestoneKey: string) => {
    if (!user) return;
    const target = roadmaps.find((r) => r.id === roadmapId);
    if (!target) return;
    const existing = target.completedMilestones || [];
    const next = existing.includes(milestoneKey)
      ? existing.filter((m) => m !== milestoneKey)
      : [...existing, milestoneKey].slice(0, 50);
    const path = `users/${user.uid}/roadmaps/${roadmapId}`;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'roadmaps', roadmapId), {
        completedMilestones: next,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteRoadmap = async (roadmapId: string) => {
    if (!user) return;
    const path = `users/${user.uid}/roadmaps/${roadmapId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'roadmaps', roadmapId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const saveConversation = async (input: {
    id?: string;
    title: string;
    language: LanguageCode;
    noStupidMode: boolean;
    messages: ChatMessage[];
  }) => {
    if (!user) return null;
    const id = input.id ? sanitizeId(input.id) : sanitizeId(`chat_${Date.now()}`);
    const ref = doc(db, 'users', user.uid, 'aiConversations', id);
    const path = `users/${user.uid}/aiConversations/${id}`;
    const trimmedMessages = input.messages.slice(-40).map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content.slice(0, 4000),
      citedGuides: m.citedGuides || [],
      isAiSuggestion: Boolean(m.isAiSuggestion),
      timestamp: m.timestamp,
    }));
    try {
      const existing = conversations.find((c) => c.id === id);
      if (existing) {
        await updateDoc(ref, {
          title: input.title.slice(0, 180),
          language: input.language,
          noStupidMode: input.noStupidMode,
          messages: trimmedMessages,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(ref, {
          userId: user.uid,
          title: input.title.slice(0, 180),
          language: input.language,
          noStupidMode: input.noStupidMode,
          messages: trimmedMessages,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      return id;
    } catch (err) {
      handleFirestoreError(err, existingConversationExists(conversations, id) ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const deleteConversation = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/aiConversations/${id}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'aiConversations', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const updateLearningProgress = async (input: {
    itemType: 'guide' | 'journey';
    itemId: string;
    title: string;
    completedSteps: string[];
    percentComplete: number;
  }) => {
    if (!user) return;
    const id = sanitizeId(`${input.itemType}_${input.itemId}`);
    const path = `users/${user.uid}/learningProgress/${id}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'learningProgress', id), {
        userId: user.uid,
        itemType: input.itemType,
        itemId: sanitizeId(input.itemId),
        title: input.title.slice(0, 200),
        completedSteps: input.completedSteps.slice(0, 40),
        percentComplete: Math.max(0, Math.min(100, Math.round(input.percentComplete))),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const exportAllUserData = () => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        account: user
          ? { uid: user.uid, displayName: user.displayName, email: user.email, preferredLanguage }
          : null,
        studentProfile,
        roadmaps,
        bookmarks,
        deadlines,
        achievements,
        learningProgress,
        conversations,
      },
      null,
      2
    );
  };

  const clearAllAiHistory = async () => {
    if (!user) return;
    for (const conv of conversations) {
      await deleteConversation(conv.id);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        userDisplayName,
        authReady,
        signingIn,
        authError,
        clearAuthError,
        preferredLanguage,
        setPreferredLanguage,
        studentProfile,
        bookmarks,
        deadlines,
        achievements,
        roadmaps,
        conversations,
        learningProgress,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        signOut,
        saveStudentProfile,
        toggleBookmark,
        isBookmarked,
        addDeadline,
        updateDeadlineStatus,
        deleteDeadline,
        addAchievement,
        deleteAchievement,
        saveRoadmap,
        toggleRoadmapMilestone,
        deleteRoadmap,
        saveConversation,
        deleteConversation,
        updateLearningProgress,
        exportAllUserData,
        clearAllAiHistory,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

function existingConversationExists(list: SavedConversationRecord[], id: string): boolean {
  return list.some((c) => c.id === id);
}

export function useFirebase() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error('useFirebase must be used inside FirebaseProvider');
  return ctx;
}
