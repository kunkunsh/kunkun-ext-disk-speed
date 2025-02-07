<script lang="ts">
	import Icon from "@iconify/svelte"
	import { clipboard, dialog, notification, toast } from "@kksh/api/ui/custom"
	import { Button } from "@kksh/svelte"
	import { targetDir } from "$lib/store"

	async function chooseDirectory() {
		const result = await dialog.open({
			directory: true
		})
		if (!result) return toast.warning("No directory selected")
		targetDir.set(result)
	}
</script>

<Button variant="outline" size="icon" on:click={chooseDirectory}>
	<Icon icon="material-symbols:folder-outline" class="h-4 w-4" />
</Button>
