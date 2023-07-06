'use client';

import useQueryBuilder from '@/lib/useQueryBuilder';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const query = useSearchParams();
  const makeQuery = useQueryBuilder();
  const [addSpice, setAddSpice] = useState<string>('');
  const [remSpice, setRemSpice] = useState<string>('');

  const handler = (action: 'add' | 'rem', spice: string) => {
    {
      if (spice === '') return alert('no spice specified');
      const route = makeQuery({
        [action]: {
          spice,
        },
      });
      router.push(route);
      action === 'add' ? setAddSpice('') : setRemSpice('');
    }
  };

  return (
    <main>
      <div>
        <button onClick={() => handler('add', addSpice)}>Add spice</button>
        <input
          type="text"
          value={addSpice}
          onChange={(e) => setAddSpice(e.target.value)}
        />
      </div>

      <div>
        <button onClick={() => handler('rem', remSpice)}>Remove spice</button>
        <input
          type="text"
          value={remSpice}
          onChange={(e) => setRemSpice(e.target.value)}
        />
      </div>

      <button onClick={() => handler('rem', '*')}>Remove all spices</button>

      <div>
        {query.getAll('spice').map((spice) => (
          <p key={spice}>{spice}</p>
        ))}
      </div>
    </main>
  );
}
