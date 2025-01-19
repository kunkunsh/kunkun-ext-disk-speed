/// <reference lib="dom" />
import * as charts from "echarts"
import { onMount } from "svelte"

export function echarts(node: HTMLElement, option: Record<string, any>) {
	let chart: charts.ECharts
	chart = charts.init(node)
	chart.setOption(option)
	setTimeout(() => {}, 500)

	return {
		update(newOption: Record<string, any>) {
			// option = newOption
			chart.setOption(newOption)
		},
		destroy() {
			chart.dispose() // Clean up when component is destroyed
		}
	}
}
