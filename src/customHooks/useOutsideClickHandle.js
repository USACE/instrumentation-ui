import { useEffect } from 'react';

/**
 * Hook that activates callback on event trigger of the passed ref
 */
export default (event, ref, callback) => {
  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener(event, handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener(event, handleClickOutside);
    };
  }, [event, ref, callback]);
};
