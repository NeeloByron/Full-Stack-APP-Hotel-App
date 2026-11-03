import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "./store"

// Use these instead of normal useDispatch/useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()