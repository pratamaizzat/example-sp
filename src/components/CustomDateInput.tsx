'use client'
import { InputHTMLAttributes } from "react"

type CustomeDateInputProps = InputHTMLAttributes<HTMLInputElement>
export default function CustomeDateInput(props: CustomeDateInputProps) {
  return <input className="border" type="data" {...props} />
}