/**
 * Google Classroom Synchronization & Deadline Monitoring Engine
 * Velqora Learning Platform
 */

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  room?: string;
  alternateLink: string;
  courseState: "ACTIVE" | "ARCHIVED";
  teacherName?: string;
}

export interface ClassroomAssignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description?: string;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  dueTime: string; // "23:59"
  dueTimestamp: number; // Unix timestamp in ms
  alternateLink: string;
  maxPoints?: number;
  isCompleted?: boolean;
  source: "google_classroom" | "manual";
}

export interface DeadlineUrgency {
  status: "urgent" | "approaching" | "normal" | "overdue" | "completed";
  label: string;
  hoursRemaining: number;
  daysRemaining: number;
  formattedCountdown: string;
  colorClass: string;
  badgeBg: string;
}

export interface ClassroomSyncState {
  isConnected: boolean;
  userEmail: string;
  accessToken?: string;
  lastSyncedAt: string | null;
  courses: ClassroomCourse[];
  assignments: ClassroomAssignment[];
  autoSync: boolean;
}

import { getActiveUserIdentifier } from "./bookmark-service";

export function getClassroomStorageKey(): string {
  const user = getActiveUserIdentifier();
  return `velqora_classroom_user_${user}`;
}

/**
 * Returns empty initial classroom data for clean user onboarding
 */
export function generateDefaultClassroomData(): {
  courses: ClassroomCourse[];
  assignments: ClassroomAssignment[];
} {
  return { courses: [], assignments: [] };
}

/**
 * Calculates real-time deadline urgency and formatted countdown
 */
export function calculateDeadlineUrgency(
  dueDate: string,
  dueTime: string = "23:59",
  isCompleted: boolean = false
): DeadlineUrgency {
  if (isCompleted) {
    return {
      status: "completed",
      label: "Selesai",
      hoursRemaining: 0,
      daysRemaining: 0,
      formattedCountdown: "Tugas telah diselesaikan",
      colorClass: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      badgeBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    };
  }

  const now = new Date();
  const targetDate = new Date(`${dueDate}T${dueTime}:00`);
  const diffMs = targetDate.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) {
    return {
      status: "overdue",
      label: "Lewat Tenggat",
      hoursRemaining: 0,
      daysRemaining: 0,
      formattedCountdown: "Tenggat waktu telah terlewati",
      colorClass: "text-rose-400 border-rose-500/40 bg-rose-500/10",
      badgeBg: "bg-rose-500/20 text-rose-400 border-rose-500/40",
    };
  }

  if (diffHours <= 24) {
    const hours = Math.max(1, diffHours);
    return {
      status: "urgent",
      label: "Mendesak",
      hoursRemaining: hours,
      daysRemaining: 1,
      formattedCountdown: `Sisa ${hours} jam lagi (${dueTime})`,
      colorClass: "text-rose-400 border-rose-500/40 bg-rose-500/10",
      badgeBg: "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse",
    };
  }

  if (diffDays <= 3) {
    return {
      status: "approaching",
      label: "Mendekati Tenggat",
      hoursRemaining: diffHours,
      daysRemaining: diffDays,
      formattedCountdown: `${diffDays} hari lagi (pukul ${dueTime})`,
      colorClass: "text-brand-400 border-brand-500/40 bg-brand-500/10",
      badgeBg: "bg-brand-500/20 text-brand-400 border-brand-500/40",
    };
  }

  return {
    status: "normal",
    label: "Aman",
    hoursRemaining: diffHours,
    daysRemaining: diffDays,
    formattedCountdown: `${diffDays} hari lagi (${dueDate})`,
    colorClass: "text-slate-300 border-white/[0.08] bg-white/[0.03]",
    badgeBg: "bg-white/[0.06] text-slate-300 border-white/[0.1]",
  };
}

/**
 * Load Google Classroom State from localStorage
 */
export function getClassroomState(): ClassroomSyncState {
  if (typeof window === "undefined") {
    return {
      isConnected: false,
      userEmail: "",
      lastSyncedAt: null,
      courses: [],
      assignments: [],
      autoSync: true,
    };
  }

  try {
    const key = getClassroomStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error("Failed to load classroom state", err);
  }

  return {
    isConnected: false,
    userEmail: "",
    lastSyncedAt: null,
    courses: [],
    assignments: [],
    autoSync: true,
  };
}

/**
 * Save Google Classroom State to localStorage
 */
export function saveClassroomState(state: ClassroomSyncState): void {
  if (typeof window === "undefined") return;
  try {
    const key = getClassroomStorageKey();
    localStorage.setItem(key, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save classroom state", err);
  }
}

/**
 * Fetch from Live Google Classroom REST API if Access Token provided
 */
export async function fetchLiveGoogleClassroom(accessToken: string): Promise<{
  courses: ClassroomCourse[];
  assignments: ClassroomAssignment[];
}> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    // 1. Fetch Active Courses
    const coursesRes = await fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE", {
      headers,
    });

    if (!coursesRes.ok) {
      throw new Error(`Google API Error: ${coursesRes.statusText}`);
    }

    const coursesData = await coursesRes.json();
    const fetchedCourses: ClassroomCourse[] = (coursesData.courses || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      section: c.section || "Kelas",
      room: c.room || "",
      alternateLink: c.alternateLink || "https://classroom.google.com",
      courseState: "ACTIVE",
      teacherName: c.ownerId || "Dosen Pengampu",
    }));

    // 2. Fetch CourseWork (Assignments) for each course
    const fetchedAssignments: ClassroomAssignment[] = [];

    for (const course of fetchedCourses) {
      try {
        const workRes = await fetch(
          `https://classroom.googleapis.com/v1/courses/${course.id}/courseWork?courseWorkStates=PUBLISHED`,
          { headers }
        );
        if (workRes.ok) {
          const workData = await workRes.json();
          (workData.courseWork || []).forEach((w: any) => {
            let dueDateStr = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
            let dueTimeStr = "23:59";

            if (w.dueDate) {
              const y = w.dueDate.year || new Date().getFullYear();
              const m = String(w.dueDate.month || 1).padStart(2, "0");
              const d = String(w.dueDate.day || 1).padStart(2, "0");
              dueDateStr = `${y}-${m}-${d}`;
            }

            if (w.dueTime) {
              const h = String(w.dueTime.hours || 23).padStart(2, "0");
              const min = String(w.dueTime.minutes || 59).padStart(2, "0");
              dueTimeStr = `${h}:${min}`;
            }

            const dueTs = new Date(`${dueDateStr}T${dueTimeStr}:00`).getTime();

            fetchedAssignments.push({
              id: w.id || `assign-${Date.now()}-${Math.random()}`,
              courseId: course.id,
              courseName: course.name,
              title: w.title || "Tugas Kuliah",
              description: w.description || "",
              dueDate: dueDateStr,
              dueTime: dueTimeStr,
              dueTimestamp: isNaN(dueTs) ? Date.now() + 86400000 : dueTs,
              alternateLink: w.alternateLink || course.alternateLink,
              maxPoints: w.maxPoints || 100,
              isCompleted: false,
              source: "google_classroom",
            });
          });
        }
      } catch (e) {
        console.warn(`Could not fetch coursework for ${course.name}`, e);
      }
    }

    return {
      courses: fetchedCourses,
      assignments: fetchedAssignments,
    };
  } catch (err: any) {
    console.error("Live Google Classroom API failed, falling back to local store", err);
    throw err;
  }
}



/**
 * Add a Custom Classroom Course
 */
export function addCustomClassroomCourse(course: {
  name: string;
  section?: string;
  room?: string;
  teacherName?: string;
  alternateLink?: string;
}): ClassroomSyncState {
  const current = getClassroomState();
  const newCourse: ClassroomCourse = {
    id: `course-${Date.now()}`,
    name: course.name,
    section: course.section || "Kelas Kuliah",
    room: course.room || "Ruang Kuliah",
    teacherName: course.teacherName || "Dosen Pengampu",
    alternateLink: course.alternateLink || "https://classroom.google.com",
    courseState: "ACTIVE",
  };

  const updatedState: ClassroomSyncState = {
    ...current,
    isConnected: true,
    courses: [newCourse, ...current.courses],
    lastSyncedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
  };

  saveClassroomState(updatedState);
  return updatedState;
}

/**
 * Add a Custom Classroom Assignment
 */
export function addCustomClassroomAssignment(assignment: {
  courseId: string;
  courseName: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime: string;
  alternateLink?: string;
  maxPoints?: number;
}): ClassroomSyncState {
  const current = getClassroomState();
  const dueTs = new Date(`${assignment.dueDate}T${assignment.dueTime}:00`).getTime();

  const newAssign: ClassroomAssignment = {
    id: `assign-${Date.now()}`,
    courseId: assignment.courseId,
    courseName: assignment.courseName,
    title: assignment.title,
    description: assignment.description || "",
    dueDate: assignment.dueDate,
    dueTime: assignment.dueTime || "23:59",
    dueTimestamp: isNaN(dueTs) ? Date.now() + 86400000 : dueTs,
    alternateLink: assignment.alternateLink || "https://classroom.google.com",
    maxPoints: assignment.maxPoints || 100,
    isCompleted: false,
    source: "google_classroom",
  };

  const updatedState: ClassroomSyncState = {
    ...current,
    isConnected: true,
    assignments: [newAssign, ...current.assignments],
    lastSyncedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
  };

  saveClassroomState(updatedState);
  return updatedState;
}

/**
 * Trigger Connect to Google Classroom & Initial Fetch
 */
export async function connectGoogleClassroom(
  userEmail: string = "mahasiswa@student.ac.id",
  accessToken?: string
): Promise<ClassroomSyncState> {
  let courses: ClassroomCourse[] = [];
  let assignments: ClassroomAssignment[] = [];

  if (accessToken && accessToken.trim()) {
    try {
      const liveData = await fetchLiveGoogleClassroom(accessToken.trim());
      courses = liveData.courses;
      assignments = liveData.assignments;
    } catch (err) {
      console.warn("Could not fetch live Google Classroom data:", err);
      courses = [];
      assignments = [];
    }
  }

  const newState: ClassroomSyncState = {
    isConnected: true,
    userEmail: userEmail || "mahasiswa@student.ac.id",
    accessToken: accessToken || undefined,
    lastSyncedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    courses,
    assignments,
    autoSync: true,
  };

  saveClassroomState(newState);
  return newState;
}

/**
 * Delete Classroom Course
 */
export function deleteClassroomCourse(courseId: string): ClassroomSyncState {
  const current = getClassroomState();
  const updatedState: ClassroomSyncState = {
    ...current,
    courses: current.courses.filter((c) => c.id !== courseId),
    assignments: current.assignments.filter((a) => a.courseId !== courseId),
  };
  saveClassroomState(updatedState);
  return updatedState;
}

/**
 * Delete Classroom Assignment
 */
export function deleteClassroomAssignment(assignmentId: string): ClassroomSyncState {
  const current = getClassroomState();
  const updatedState: ClassroomSyncState = {
    ...current,
    assignments: current.assignments.filter((a) => a.id !== assignmentId),
  };
  saveClassroomState(updatedState);
  return updatedState;
}

/**
 * Disconnect Google Classroom
 */
export function disconnectGoogleClassroom(): ClassroomSyncState {
  const emptyState: ClassroomSyncState = {
    isConnected: false,
    userEmail: "",
    lastSyncedAt: null,
    courses: [],
    assignments: [],
    autoSync: false,
  };

  saveClassroomState(emptyState);
  return emptyState;
}

/**
 * Get active urgent notifications for Notification Center
 */
export function getUrgentClassroomAlerts(): {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "system" | "class";
  read: boolean;
  link: string;
}[] {
  const state = getClassroomState();
  if (!state.isConnected || state.assignments.length === 0) return [];

  const alerts: {
    id: string;
    title: string;
    message: string;
    time: string;
    type: "system" | "class";
    read: boolean;
    link: string;
  }[] = [];

  for (const assign of state.assignments) {
    if (assign.isCompleted) continue;
    const urgency = calculateDeadlineUrgency(assign.dueDate, assign.dueTime, assign.isCompleted);
    if (urgency.status === "urgent") {
      alerts.push({
        id: `alert-${assign.id}`,
        title: `Tenggat Waktu Mendesak: ${assign.courseName}`,
        message: `${assign.title} harus dikumpulkan ${urgency.formattedCountdown}.`,
        time: "Segera kumpulkan",
        type: "class",
        read: false,
        link: "/dashboard/jadwal",
      });
    } else if (urgency.status === "approaching") {
      alerts.push({
        id: `alert-${assign.id}`,
        title: `Tugas Mendekati Tenggat: ${assign.courseName}`,
        message: `${assign.title} batas pengumpulan ${urgency.formattedCountdown}.`,
        time: "1 hari lagi",
        type: "class",
        read: false,
        link: "/dashboard/jadwal",
      });
    }
  }

  return alerts;
}
