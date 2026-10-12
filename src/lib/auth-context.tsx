import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";
import type { UserDocument, WorkspaceDocument, WorkspaceMemberDocument } from "@/types/database";

interface AuthContextType {
  user: User | null;
  userProfile: UserDocument | null;
  activeWorkspace: WorkspaceDocument | null;
  userWorkspaces: WorkspaceDocument[];
  loading: boolean;
  isConfigured: boolean;
  isMockMode: boolean;
  setMockMode: (mock: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    workspaceName: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_STORAGE_KEY = "chatflow_auth_mock_mode";

export function AuthProvider({ children }: { children: ReactNode }) {
  const isConfigured = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserDocument | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceDocument | null>(null);
  const [userWorkspaces, setUserWorkspaces] = useState<WorkspaceDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // If Firebase is not configured, default to mock mode.
  // If configured, check user's saved preference or default to live mode.
  const [isMockMode, setIsMockModeState] = useState<boolean>(() => {
    if (typeof window === "undefined") return !isConfigured;
    if (!isConfigured) return true;
    const saved = localStorage.getItem(MOCK_STORAGE_KEY);
    return saved === "true";
  });

  const setMockMode = (mock: boolean) => {
    setIsMockModeState(mock);
    if (typeof window !== "undefined") {
      localStorage.setItem(MOCK_STORAGE_KEY, String(mock));
    }
  };

  // Helper to load user profile and workspaces from Firestore
  async function loadUserData(firebaseUser: User) {
    if (!db) return;
    try {
      // 1. Fetch user doc
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let profileData: UserDocument;
      if (userSnap.exists()) {
        profileData = userSnap.data() as UserDocument;
        setUserProfile(profileData);
      } else {
        // Fallback user document if missing
        profileData = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "Workspace User",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, profileData);
        setUserProfile(profileData);
      }

      // 2. Fetch user's workspaces
      const workspaces: WorkspaceDocument[] = [];
      const workspacesQuery = query(
        collection(db, "workspaces"),
        where("ownerId", "==", firebaseUser.uid),
      );
      const workspacesSnap = await getDocs(workspacesQuery);

      workspacesSnap.forEach((d) => {
        workspaces.push(d.data() as WorkspaceDocument);
      });

      setUserWorkspaces(workspaces);

      // Select active workspace
      if (workspaces.length > 0) {
        const defaultWs =
          workspaces.find((w) => w.id === profileData.defaultWorkspaceId) || workspaces[0] || null;
        setActiveWorkspace(defaultWs);
      } else {
        // Auto-provision initial personal workspace if none exists
        const newWsId = `ws_${Date.now()}`;
        const newWs: WorkspaceDocument = {
          id: newWsId,
          name: `${profileData.displayName}'s Workspace`,
          ownerId: firebaseUser.uid,
          plan: "Starter",
          monthlyMessageLimit: 2000,
          currentPeriodUsage: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "workspaces", newWsId), newWs);
        await setDoc(doc(db, "workspaces", newWsId, "members", firebaseUser.uid), {
          id: `${newWsId}_${firebaseUser.uid}`,
          workspaceId: newWsId,
          userId: firebaseUser.uid,
          userEmail: firebaseUser.email || "",
          role: "Owner",
          joinedAt: new Date().toISOString(),
        });

        setUserWorkspaces([newWs]);
        setActiveWorkspace(newWs);
      }
    } catch (err) {
      console.error("Error loading Firestore user data:", err);
    }
  }

  // Subscribe to Firebase Auth state changes
  useEffect(() => {
    if (!auth || !isConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await loadUserData(firebaseUser);
      } else {
        setUserProfile(null);
        setActiveWorkspace(null);
        setUserWorkspaces([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isConfigured]);

  const signIn = async (email: string, pass: string) => {
    if (!auth || !isConfigured) {
      throw new Error(
        "Firebase is not configured. Please add your credentials to .env.local or use Mock Mode.",
      );
    }
    await signInWithEmailAndPassword(auth, email, pass);
    setMockMode(false);
  };

  const signUp = async (
    email: string,
    pass: string,
    displayName: string,
    workspaceName: string,
  ) => {
    if (!auth || !db || !isConfigured) {
      throw new Error(
        "Firebase is not configured. Please add your credentials to .env.local or use Mock Mode.",
      );
    }

    // 1. Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const createdUser = userCredential.user;

    // 2. Set display name
    await updateProfile(createdUser, { displayName });

    const now = new Date().toISOString();
    const wsId = `ws_${Date.now()}`;

    // 3. Create initial workspace with owner isolation
    const initialWorkspace: WorkspaceDocument = {
      id: wsId,
      name: workspaceName.trim() || `${displayName}'s Workspace`,
      ownerId: createdUser.uid,
      plan: "Starter",
      monthlyMessageLimit: 2000,
      currentPeriodUsage: 0,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, "workspaces", wsId), initialWorkspace);

    // 4. Add owner membership record
    const memberRecord: WorkspaceMemberDocument = {
      id: `${wsId}_${createdUser.uid}`,
      workspaceId: wsId,
      userId: createdUser.uid,
      userEmail: email,
      role: "Owner",
      joinedAt: now,
    };
    await setDoc(doc(db, "workspaces", wsId, "members", createdUser.uid), memberRecord);

    // 5. Create user profile document
    const userDocData: UserDocument = {
      id: createdUser.uid,
      email,
      displayName,
      defaultWorkspaceId: wsId,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, "users", createdUser.uid), userDocData);

    // 6. Update local state
    setUser(createdUser);
    setUserProfile(userDocData);
    setActiveWorkspace(initialWorkspace);
    setUserWorkspaces([initialWorkspace]);
    setMockMode(false);
  };

  const signOut = async () => {
    if (auth && isConfigured) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setUserProfile(null);
    setActiveWorkspace(null);
    setUserWorkspaces([]);
  };

  const switchWorkspace = async (workspaceId: string) => {
    const found = userWorkspaces.find((w) => w.id === workspaceId);
    if (found) {
      setActiveWorkspace(found);
      if (db && user) {
        await setDoc(
          doc(db, "users", user.uid),
          { defaultWorkspaceId: workspaceId, updatedAt: new Date().toISOString() },
          { merge: true },
        );
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        activeWorkspace,
        userWorkspaces,
        loading,
        isConfigured,
        isMockMode,
        setMockMode,
        signIn,
        signUp,
        signOut,
        switchWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
