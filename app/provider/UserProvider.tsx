import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface StudySession {
  totalHours: number;
  wordsLearned: number;
  phrasesLearned: number;
  grammarTopicsCompleted: number;
  exercisesCompleted: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  studySession: StudySession;
  updateUser: (newUserData: Partial<User>) => Promise<void>;
  updateStudySession: (sessionUpdate: Partial<StudySession>) => Promise<void>;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [studySession, setStudySession] = useState<StudySession>({
    totalHours: 0,
    wordsLearned: 0,
    phrasesLearned: 0,
    grammarTopicsCompleted: 0,
    exercisesCompleted: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      const sessionData = await AsyncStorage.getItem("studySession");

      if (userData) setUser(JSON.parse(userData));
      if (sessionData) setStudySession(JSON.parse(sessionData));
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const updateUser = async (newUserData: Partial<User>) => {
    try {
      const updatedUser: User = {
        id: newUserData.id ?? user?.id ?? "",
        name: newUserData.name ?? user?.name ?? "",
        email: newUserData.email ?? user?.email ?? "",
      };

      setUser(updatedUser);
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const updateStudySession = async (sessionUpdate: Partial<StudySession>) => {
    try {
      const updatedSession = { ...studySession, ...sessionUpdate };
      setStudySession(updatedSession);
      await AsyncStorage.setItem(
        "studySession",
        JSON.stringify(updatedSession)
      );
    } catch (error) {
      console.error("Error updating study session:", error);
    }
  };

  const login = async (userData: User, token: string) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setStudySession({
        totalHours: 0,
        wordsLearned: 0,
        phrasesLearned: 0,
        grammarTopicsCompleted: 0,
        exercisesCompleted: 0,
      });
      await AsyncStorage.multiRemove(["userToken", "userData", "studySession"]);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        studySession,
        updateUser,
        updateStudySession,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
