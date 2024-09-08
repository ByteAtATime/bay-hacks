<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { signInWithPopup } from "firebase/auth";
	import { auth } from "$lib/firebase";
	import { GoogleAuthProvider } from "firebase/auth";
	import { goto } from "$app/navigation";

	const logInWithGoogle = async () => {
		await signInWithPopup(auth, new GoogleAuthProvider());

		await goto("/");
	};
</script>

<Card.Root class="mx-auto max-w-sm border-none">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input id="email" type="email" placeholder="m@example.com" required />
			</div>
			<div class="grid gap-2">
				<div class="flex items-center">
					<Label for="password">Password</Label>
					<a href="##" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
				</div>
				<Input id="password" type="password" required />
			</div>
			<Button type="submit" class="w-full">Login</Button>
			<Button variant="outline" class="w-full" on:click={logInWithGoogle}>Login with Google</Button>
		</div>
	</Card.Content>
</Card.Root>
