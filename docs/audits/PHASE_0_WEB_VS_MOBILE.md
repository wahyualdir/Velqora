# VELQORA — PHASE 0: WEB VS MOBILE EXPERIENCE MATRIX

---

## 1. CORE PHILOSOPHICAL SEPARATION

| Dimension | Web Desktop ($\ge 1024\text{px}$) | Mobile App ($< 768\text{px}$) | Tablet Hybrid ($768\text{px} - 1023\text{px}$) |
| :--- | :--- | :--- | :--- |
| **Product Target** | Professional Learning Workspace | Personal Learning App | Adaptive Hybrid Workspace |
| **Primary Interaction** | Mouse & Keyboard shortcuts | Single-hand thumb gestures | Touch & Stylus / Keyboard |
| **Information Density** | High (Tables, multi-column panels) | Focused (1 item at a time, vertical stack) | Medium (2-column flow) |
| **Navigation Pattern** | Persistent Sidebar (245px/68px) + Top Bar | 5-Destination Bottom Nav + Slide Drawer | Compact Sidebar / Drawer |
| **Action Pattern** | Contextual `...` dropdowns & toolbars | Tap row $\to$ Modal bottom sheet | Action bars & touch menus |
| **Dialogs / Modals** | Centered desktop dialogs | Slide-up modal bottom sheets | Centered adaptive dialogs |

---

## 2. COMPONENT STRATEGY MATRIX

| Feature / Domain | Shared Core Logic | Desktop Web UI | Mobile App UI | Separation Strategy |
| :--- | :---: | :--- | :--- | :--- |
| **Dashboard** | YES (`study-actions`) | `DesktopDashboardView` (2-Col workspace) | `MobileDashboardView` (Hero card + feed) | `ExperienceAdaptive` |
| **Navigation** | YES (Route paths) | `Sidebar` + `DesktopTopBar` | `MobileBottomNav` + `MobileMenuDrawer` | Media Query & Experience hook |
| **Task Management** | YES (`getTasks()`) | `DesktopTaskWorkspace` (`DesktopTable`) | `MobileTaskList` (Sheet status changer) | `ExperienceAdaptive` |
| **Curriculum / Modul** | YES (`getModules()`) | `ModuleListItem` (Dense table row) | `MobileModuleList` (Touch card stack) | `ExperienceAdaptive` |
| **Study Materials** | YES (`getMaterials()`) | File workspace & preview modal | `MobileMaterialList` & preview sheet | `ExperienceAdaptive` |
| **Academic Schedule** | YES (`getSchedules()`) | Interactive week calendar grid | `MobileScheduleAgenda` (Chronological) | `ExperienceAdaptive` |
| **AI Tutor** | YES (`askAITutorAction`) | 2-Column chat workspace with sidebar | Full-screen conversational view + drawer | Layout responsive grid |
| **Code / OCR Playground**| YES (Execution engine) | Split-pane Editor & Live Console | Tabbed Code / Console interactive flow | Responsive tab panel |
| **Settings** | YES (Profile & Theme API)| 2-Column left nav & content surface | Grouped native settings list | `SettingsNav` & sub-panels |
| **Download & PWA** | YES (PWA Engine) | 3-Column platform guide & download | 1-Column quick install CTA & guide | Platform detection tabs |
