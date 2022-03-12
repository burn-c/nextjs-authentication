import { FormEvent, useContext, useState } from 'react';

import { AuthContext } from '@/context/AuthContext';

import styles from '@/styles/Home.module.css';

export default function Home() {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await signIn({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="email"
        name="Email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        name="Password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Entrar</button>
    </form>
  );
}
