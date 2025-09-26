/* eslint-disable no-alert */
'use client';

import { useState } from 'react';

import { signIn, signOut, signUp, useSession } from '@/lib/auth-client';

const HomePage = () => {
	const { data: session } = useSession();

	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [login, setLogin] = useState(false);

	const onSubmit = () => {
		if (!name || !email || !password) return;

		if (login) {
			signIn.email(
				{
					email,
					password,
				},
				{
					onError: (e) => {
						window.alert(e.error.message || 'Something went wrong!');
					},
					onSuccess: () => {
						window.alert('Success!');
					},
				}
			);
		} else {
			signUp.email(
				{
					email,
					name,
					password,
				},
				{
					onError: (e) => {
						window.alert(e.error.message || 'Something went wrong!');
					},
					onSuccess: () => {
						window.alert('Success!');
					},
				}
			);
		}
	};

	if (!!session) {
		return (
			<div>
				<pre>{JSON.stringify(session.user)}</pre>

				<br />
				<button onClick={() => signOut()}>Sign out</button>
			</div>
		);
	}

	return (
		<div>
			<input value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
			<br />
			<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
			<br />
			<input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
			<br />
			<input type='checkbox' checked={login} onChange={(e) => setLogin(e.target.checked)} /> Login in
			<br />
			<button onClick={onSubmit}>Submit</button>
		</div>
	);
};
export default HomePage;
