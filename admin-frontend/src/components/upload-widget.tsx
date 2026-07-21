import { UploadWidgetValue } from '@/types';
import { UploadCloud } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

export default function UploadWidget({value=null,onChange,disabled=false}) {
    
    const widgetRef=useRef<CloudinaryWidget |null>(null);
    const onChangeRef=useRef(onChange)
    const [preview,setPreview]=useState<UploadWidgetValue| null>(value);
    const [deleteToken,setDeleteToken]=useState<string | null>(null);
    const [isRemoving,setIsRemoving]=useState(false);

     useEffect(()=>{
        setPreview(value);
        if(!value) setDeleteToken(null);
        
    },[value])

    useEffect(()=>{
        onChangeRef.current=onChange;

    },[onChange])

    const openWidget=()=>{
        if(!disabled) widgetRef.current?.open();
    }

    const removeFromCloudinary=async()=>{}
  return (
    <div className='space-y-2'>
        {preview?(
            <div className='upload-preview'></div>
        ):<div className='upload-dropzone' role='button' tabIndex={0}
        onClick={openWidget} onKeyDown={(event)=>{
            if(event.key==='Enter')
            {
                event.preventDefault();
                openWidget();
            }
        }}>
            <div className='upload-prompt'>
                <UploadCloud className='icon'></UploadCloud>
                <div>
                    <p>Click to upload photo</p>
                    <p>PNG,JPG upto 5MB</p>
                </div>
                </div></div>}
    </div>
  )
}
