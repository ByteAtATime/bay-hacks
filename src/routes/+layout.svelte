<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { FirebaseApp } from "sveltefire";
	import { auth, firestore } from "$lib/firebase";
	import { Toaster } from "$lib/components/ui/sonner";
</script>

<ModeWatcher />
<Toaster />

<FirebaseApp {firestore} {auth}>
	<div class="flex h-screen flex-col">
		<Header />

		<div class="flex grow flex-col">
			<slot />
		</div>

		<Footer />
	</div>
</FirebaseApp>
