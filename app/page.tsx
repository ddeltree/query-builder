'use client';

import { makeQuery } from '@/src/makeQuery';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const qparams = useSearchParams();
  const [addSpice, setAddSpice] = useState<string>('');
  const [remSpice, setRemSpice] = useState<string>('');

  const handler = (action: 'add' | 'rem', spice: string) => {
    {
      if (spice === '') return alert('no spice specified');
      const route = makeQuery(qparams.toString(), {
        [action]: {
          spice,
        },
      });
      const loc = window.location.pathname;
      router.push(loc + '?' + route);
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
        {qparams.getAll('spice').map((spice, i) => (
          <p key={i}>{spice}</p>
        ))}
      </div>
    </main>
  );
}
