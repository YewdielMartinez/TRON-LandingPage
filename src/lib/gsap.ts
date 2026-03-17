/**
 * Singleton GSAP initialization.
 * Import this module once (ideally at the app entry point or wherever GSAP
 * plugins are first needed) to avoid registering plugins multiple times.
 */
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export { gsap }
