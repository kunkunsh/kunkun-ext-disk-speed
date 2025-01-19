<script lang="ts">
	import { echarts } from "$lib/echarts.action.svelte"
	import { cn } from "$lib/utils"
	// import * as echarts from "echarts"
	import { onMount } from "svelte"

	onMount(() => {})

	const {
		speedInMBps,
		title,
		class: className
	}: { speedInMBps: number; title: string; class?: string } = $props()
	const maxSpeed = $derived.by(() => {
		if (speedInMBps <= 100) return 100
		if (speedInMBps <= 500) return 500
		if (speedInMBps <= 1_000) return 1_000
		if (speedInMBps <= 2_000) return 2_000
		if (speedInMBps <= 5_000) return 5_000
		if (speedInMBps <= 10_000) return 10_000
		return 100_000
	})
	const option = $derived({
		tooltip: {
			formatter: "{a} {b} : {c}%"
		},
		series: [
			{
				name: "Speed",
				type: "gauge",
				min: 0,
				max: maxSpeed,
				splitNumber: 5,
				// progress: {
				// 	show: true
				// },
				pointer: {
					itemStyle: {
						color: "auto"
					}
				},
				axisTick: {
					// distance: -15,
					// length: 8,
					// lineStyle: {
					// 	color: "#fff",
					// 	width: 2
					// }
				},
				// splitLine: {
				// 	distance: 0,
				// 	// length: 30,
				// 	lineStyle: {
				// 		color: "#fff",
				// 		width: 4
				// 	}
				// },
				axisLabel: {
					color: "inherit",
					distance: 20,
					fontSize: 15
				},
				axisLine: {
					lineStyle: {
						width: 10,
						color: [
							[0.3, "#67e0e3"],
							[0.7, "#37a2da"],
							[1, "#fd666d"]
						]
					}
				},
				detail: {
					fontSize: 20,
					valueAnimation: true,
					formatter: "{value}MB/s",
					color: "inherit"
				},
				title: {
					fontSize: 20
				},
				data: [
					{
						value: Math.round(speedInMBps),
						name: title
					}
				]
			}
		]
	})
</script>

<div
	class={cn("flex min-h-96 min-w-96 items-center justify-center", className)}
	use:echarts={option}
></div>
