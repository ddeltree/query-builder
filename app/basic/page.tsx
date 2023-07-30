'use client';
import { makeQuery } from '@/src/makeQuery';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Page() {
  const params = useSearchParams();
  return (
    <button
      onClick={() => {
        const query = makeQuery(params.toString(), {
          add: {
            firstName: 'Albert',
            secondName: 'Einstein',
          },
          rem: {
            firstName: '*',
            secondName: '*',
          },
        });
        console.log(query);
      }}
    >
      asd
    </button>
  );
}
