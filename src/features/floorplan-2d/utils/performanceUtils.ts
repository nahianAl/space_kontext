/**
 * Performance utility for measuring action execution time
 * Higher-order function that wraps actions to measure and log their execution duration
 * Updates the performance store with timing information
 */
import { usePerformanceStore } from '../store/performanceStore';
export const timeAction = <T extends (...args: any[]) => any>(
  name: string,
  action: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now();
    const result = action(...args);
    const end = performance.now();
    const duration = end - start;
    
    // Log the action to our performance store
    usePerformanceStore.getState().logAction(name, duration);
    
    // If the action is asynchronous (returns a promise), measure until it resolves.
    if (result && typeof result.then === 'function') {
      return result.then((resolvedResult: any) => {
        const endAsync = performance.now();
        const durationAsync = endAsync - start;
        usePerformanceStore.getState().logAction(`${name} (async)`, durationAsync);
        return resolvedResult;
      });
    }

    return result;
  };
};
