import {useEffect, useState} from "react";

type RequestHookResult<T> = {
  readonly loading: boolean;
  readonly error: Error | null;
  readonly result: T | null;
  readonly fetch: () => void;
}

export const useRequest = (action: () => Promise<unknown>): RequestHookResult<unknown> => {
  const initialFetchTrigger = 0;
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<Error | null>(null);
  const [ result, setResult ] = useState<unknown | null>(null);
  const [ fetchTrigger, setFetchTrigger ] = useState(initialFetchTrigger);

  useEffect(() => {
    const fetch = (): void => {
      try {
        if (fetchTrigger === initialFetchTrigger) return;

        setLoading(true);
        action()
          .then((res: unknown) => {
            setResult(res);
            setLoading(false);
          })
          .catch((e) => {
            console.error(e);
          });
      } catch (e: unknown) {
        setError(e as Error);
        setLoading(false);
      }
    };

    fetch();
  }, [ fetchTrigger ]);

  return {
    loading,
    error,
    result,
    fetch : (): void => {
      setFetchTrigger(fetchTrigger + 1);
    },
  };
};
