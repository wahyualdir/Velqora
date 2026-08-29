/**
 * Velqora Academic Schedule Intelligence — Canonical Constants & Domain Invariants
 * Single Source of Truth for all schedule, workload, break, and optimization rules.
 */

export const ACADEMIC_CONSTANTS = {
  /**
   * Default daily study target for independent study (minutes).
   * 240 minutes = 4 hours.
   */
  DEFAULT_MAX_DAILY_STUDY_MINUTES: 240,

  /**
   * Minimum allowable daily study target in user preferences (minutes).
   */
  MIN_DAILY_STUDY_MINUTES: 60,

  /**
   * Absolute hard cap for total daily academic activity (kuliah + belajar) (minutes).
   * 360 minutes = 6 hours. Exceeding this triggers workload overload & critical regression.
   */
  DAILY_WORKLOAD_HARD_CAP_MINUTES: 360,

  /**
   * Default duration for an individual study session (minutes).
   */
  DEFAULT_SESSION_DURATION_MINUTES: 60,

  /**
   * Maximum single continuous study session recommended by the Adaptive Planner (minutes).
   */
  ADAPTIVE_MAX_SINGLE_SESSION_MINUTES: 90,

  /**
   * Minimum session duration permitted in plan validation (minutes).
   */
  MIN_SESSION_DURATION_MINUTES: 15,

  /**
   * Maximum single session duration permitted in general requests (minutes).
   */
  MAX_SESSION_DURATION_MINUTES: 360,

  /**
   * Default rest/break duration between consecutive sessions (minutes).
   */
  DEFAULT_BREAK_DURATION_MINUTES: 30,

  /**
   * Minimum break buffer required between dense sessions (minutes).
   */
  MIN_BREAK_BUFFER_MINUTES: 30,

  /**
   * Punctuality tolerance window for session start time variance (minutes).
   * Actual starts within +/- 15 minutes of planned time are considered punctual.
   */
  PUNCTUALITY_TOLERANCE_MINUTES: 15,

  /**
   * Strict clamping bounds for empirical recommendation calibration multipliers.
   */
  CALIBRATION_MULTIPLIER_MIN: 0.70,
  CALIBRATION_MULTIPLIER_MAX: 1.30,

  /**
   * Multi-period academic health score trend delta thresholds.
   */
  HEALTH_TREND_IMPROVING_THRESHOLD: 3,
  HEALTH_TREND_DECLINING_THRESHOLD: -3,

  /**
   * Maximum file upload size for schedule import documents (bytes).
   * 15MB = 15 * 1024 * 1024 bytes.
   */
  MAX_SCHEDULE_UPLOAD_SIZE_BYTES: 15 * 1024 * 1024,
} as const;

export type AcademicConstants = typeof ACADEMIC_CONSTANTS;
