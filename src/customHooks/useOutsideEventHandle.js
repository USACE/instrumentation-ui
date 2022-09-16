import { useEffect } from 'react';

/**
 * Hook that activates callback on event trigger of the passed ref
 */
const useOutsideEventHandle = (ref, callback) => {
  useEffect(() => {
    const listener = (event) => {
      if (Array.isArray(ref)) {
        let contained = false;
        ref.forEach(r => {
          if (r.current?.contains(event.target)) {
            contained = true;
          }
        });

        if (!contained) callback(event);
      } else {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        callback(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref]);
};

export default useOutsideEventHandle;
