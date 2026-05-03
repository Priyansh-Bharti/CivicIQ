import { ElectionPhase } from '../types/election';

/**
 * Timeline Engine
 * A pure logic engine for processing election phase data and calculating metrics.
 * Decoupled from React to ensure 100% testability and architectural purity.
 */
export class TimelineEngine {
  /**
   * Calculates the overall completion percentage of the election journey.
   * @param {ElectionPhase[]} phases The list of phases.
   * @param {Record<string, boolean>} progress The user's progress map.
   * @returns {number} Percentage from 0 to 100.
   */
  public static calculateCompletion(
    phases: ElectionPhase[],
    progress: Record<string, boolean>
  ): number {
    if (!phases.length) return 0;
    const completedCount = Object.values(progress).filter(Boolean).length;
    return Math.round((completedCount / phases.length) * 100);
  }

  /**
   * Identifies the next logical step for the user based on current progress.
   * @param {ElectionPhase[]} phases The list of phases.
   * @param {Record<string, boolean>} progress The user's progress map.
   * @returns {ElectionPhase | null} The next phase to focus on.
   */
  public static getNextPhase(
    phases: ElectionPhase[],
    progress: Record<string, boolean>
  ): ElectionPhase | null {
    return phases.find(phase => !progress[phase.id]) || null;
  }

  /**
   * Determines if a phase is accessible to the user (e.g., prerequisites met).
   * @param {string} phaseId The phase to check.
   * @param {ElectionPhase[]} phases The full list of phases.
   * @param {Record<string, boolean>} progress The user's progress map.
   * @returns {boolean} True if the phase can be accessed.
   */
  public static isPhaseAccessible(
    phaseId: string,
    phases: ElectionPhase[],
    progress: Record<string, boolean>
  ): boolean {
    const index = phases.findIndex(p => p.id === phaseId);
    if (index <= 0) return true;
    
    // Logic: A phase is accessible if the previous one is completed
    const previousPhase = phases[index - 1];
    return !!progress[previousPhase.id];
  }
}
