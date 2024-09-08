<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import ddoiLogo from "$lib/assets/ddoi.jpg";
	import Search from "$lib/components/Search.svelte";
	import { Button } from "$lib/components/ui/button";
	import { SignedIn, SignedOut } from "sveltefire";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
</script>

<nav class="flex items-center justify-between gap-x-4 p-2">
	<a href="/" class="flex items-center gap-x-2">
		<Avatar.Root>
			<Avatar.Image src={ddoiLogo} alt="DDOI" />
		</Avatar.Root>
	</a>

	<Search />

	<SignedOut>
		<Button variant="outline" size="sm" href="/login">Log In</Button>
	</SignedOut>
	<SignedIn let:user let:signOut>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root>
					<Avatar.Image src={user.photoURL} alt={user.displayName} />
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label>{user.displayName}</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item on:click={signOut}>Sign Out</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</SignedIn>
</nav>
