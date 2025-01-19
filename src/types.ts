export type Progress = { totalMB: number; totalDuration: number }
export interface API {
	sequentialWriteTest: (
		options: {
			filePath: string
			sizeInMB: number
			rounds: number
			bufferSizeMB: number
			keepTheFile?: boolean
		},
		callback?: (progress: Progress) => void
	) => Promise<Progress>
	sequentialReadTest: (filePath: string, options: { deleteAfter: boolean }) => Promise<Progress>
	createEmptyFile: (filePath: string, sizeInMB: number) => Promise<void>
}
