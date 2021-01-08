import { useEffect } from 'react';

/**
 * Hook that activates callback on event trigger of the passed ref
 */
const useOutsideEventHandle = (event, ref, callback) => {
  useEffect(() => {
    const handleEventOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener(event, handleEventOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener(event, handleEventOutside);
    };
  }, [event, ref, callback]);
};

export default useOutsideEventHandle;
