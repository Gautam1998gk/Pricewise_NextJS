"use client"

import { ScrapeAndStoreProduct } from "@/lib/actions"
import { FormEvent, useState } from "react"

const isValidAmazonProductUrl = (url:string)=>{
  try {
    const parsedURL = new URL(url)
    const hostname =parsedURL.hostname
    if(hostname.includes("amazon.")||
    hostname.includes("amazon.com")||
    hostname.includes("amazon")
    ) return true
  } catch (error) {
    return false
  }
}
const SearchBar = () => {
  const [searchPrompt,setSearchPrompt]=useState("")
  const [loading,setLoading]=useState(false)
 const handleSubmit =async(e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
   const validLink = isValidAmazonProductUrl(searchPrompt)
   if(!validLink){
    return alert("please provide a valid link")
   }
   try {
    setLoading(true)

    const product=await ScrapeAndStoreProduct(searchPrompt)
    setSearchPrompt("")

   } catch (error) {
    console.log(error);
    
   }finally{
    setLoading(false)
   }
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mt-12">
        <input
        type="text"
        className="searchbar-input"
        placeholder="Enter Product Link"
        value={searchPrompt}
        onChange={e=>setSearchPrompt(e.target.value)}
        />
        <button className="searchbar-btn"
        disabled={searchPrompt===""}>{loading? "Searching...":"Search"}</button>
    </form>
  )
}

export default SearchBar