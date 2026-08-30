# VELQORA — ARCHITECTURAL SPECIFICATION: WEB VS MOBILE BOUNDARY

---

## 1. CORE PRINCIPLE

> **SAME PRODUCT — DIFFERENT EXPERIENCE**
> 
> Web Desktop ($\ge 1024\text{px}$) and Mobile App ($< 768\text{px}$) share 100% of the backend, data, authentication, business logic, and API contracts.
> However, their presentation layer, navigation model, information density, and interaction patterns are intentionally distinct.

---

## 2. BOUNDARY DECOMPOSITION

```text
                               ┌────────────────────────────────┐
                               │       SHARED BACKEND CORE      │
                               │  - Supabase Database & Auth    │
                               │  - Server Actions & API        │
                               │  - AI, OCR & Converter Engines │
                               │  - TypeScript Domain Types     │
                               └───────────────┬────────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       │                                               │
                       ▼                                               ▼
     ┌───────────────────────────────────┐           ┌───────────────────────────────────┐
     │           VELQORA WEB             │           │        VELQORA MOBILE APP         │
     │   (Desktop Workspace >= 1024px)   │           │   (Personal Learning App < 768px) │
     ├───────────────────────────────────┤           ├───────────────────────────────────┤
     │ • Information-Dense Multi-Column  │           │ • Single-Hand Thumb Ergonomics    │
     │ • 245px/68px Collapsible Sidebar  │           │ • 5-Destination Bottom Navigation │
     │ • Spotlight Search (Ctrl + K)     │           │ • Slide-Over Secondary Drawer     │
     │ • Structured Desktop Tables       │           │ • Tap Row -> Modal Bottom Sheet   │
     │ • Split-Pane File Previews        │           │ • Vertical Single-Column Feed     │
     │ • Contextual '...' Hover Actions  │           │ • Safe Area Inset Protection      │
     └───────────────────────────────────┘           └───────────────────────────────────┘
```

---

## 3. COMPONENT PARTICIPATION MATRIX

| Component Domain | Shared Contract | Web Workspace Implementation | Mobile App Implementation |
| :--- | :---: | :--- | :--- |
| **Shell & Layout** | User Session / Theme | `DesktopWorkspace` + `Sidebar` + `DesktopTopBar` | `MobileAppShell` + `MobileTopBar` + `MobileBottomNav` |
| **Primary Navigation** | Route Map | Left vertical sidebar with category groupings | Fixed 5-destination bottom navigation bar |
| **Secondary Navigation**| Route Map | Category links & header utility actions | Slide-over `MobileMenuDrawer` |
| **Dashboard** | `getDashboardMetrics()` | 2-Column layout (8-col modules / 4-col tasks) | Single-column (Greeting $\to$ Continue $\to$ Tasks $\to$ Actions) |
| **Tasks View** | `getTasks()` / `update()` | `DesktopTable` with sortable headers & `...` | `MobileTaskList` with touch bottom sheet |
| **Modules View** | `getModules()` | Multi-column grid with detailed metadata | Vertical stack cards with lesson counters |
| **Materials View** | `getMaterials()` | File workspace table & preview modal | Compact file list & preview sheet |
| **Schedule View** | `getSchedules()` | Interactive week calendar matrix | Chronological day agenda list |
| **Settings View** | Supabase Profile API | Left sticky navigation & content card | Native-style grouped settings list |
| **Modals / Sheets** | Form Actions | Centered desktop dialogs (`Dialog`) | Slide-up modal bottom sheets (`Sheet`) |
