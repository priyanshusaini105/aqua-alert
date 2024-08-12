import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

export const getHeight = (percentage: number) => (height * percentage) / 100
export const getWidth = (percentage: number) => (width * percentage) / 100
