<script lang="ts">
	import { Select } from "@kksh/svelte"
	import { stress } from "$lib/store"
	import { type Selected } from "bits-ui"

	const options = [
		{ value: 1, label: "1GB" },
		{ value: 2, label: "2GB" },
		{ value: 3, label: "3GB" },
		{ value: 4, label: "4GB" },
		{ value: 5, label: "5GB" }
	]

	let selected: Selected<number> = $state(options[0])

	$effect(() => {
		if (selected) {
			stress.set(selected.value)
		}
	})
</script>

<Select.Root bind:selected>
	<Select.Trigger class="w-56">
		<Select.Value placeholder="Pick a Stress Level" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Stress</Select.Label>
			{#each options as option}
				<Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name="stress-level" />
</Select.Root>
