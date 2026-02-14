import { useSyncExternalStore, useState, useCallback } from 'react';

export function useQuery(collection) {
  const [loading, setLoading] = useState(true);
  
  const subscribe = useCallback((callback) => {
      setLoading(false);
      const unsubscribe =  collection?.subscribe(() => {
        callback();
      });
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      }
  }, [collection]);
  
  const getSnapshot = useCallback(() => {
      return collection?.getList();
  }, [collection]);

  const data = useSyncExternalStore(subscribe, getSnapshot);
  
  return {data, loading};
}

export const WebsimSocket = window.WebsimSocket;