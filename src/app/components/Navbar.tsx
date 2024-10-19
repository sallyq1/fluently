import React from 'react';

import Image from 'next/image';
import BellIcon from '@/app/assets/notification-bell-icon.svg';
import SettingsIcon from '@/app/assets/settings-icon.svg'
import SearchIcon from '@/app/assets/search-icon.svg'
import ProfilePic from "@/app/assets/profile-pic.png"



const Navbar = () => {
  return (
    <div className='px-20 py-5 shadow-lg'>

<div className='flex items-center justify-between'>
<Image src="/fluently-logo.png" alt="fluently logo" height={10} width={800} className='h-18 w-72'/>

<div className='w-[500px] h-12 rounded-full  bg-[#1C7F81]/10 flex items-center gap-4 p-3'>
<SearchIcon/> <h1>Search</h1>
</div>

<div className='flex items-center'>
  <Image src="/profile-pic.png" alt="profile pic" width={70} height={70} className='h-16 w-16'/>
  <BellIcon/>
  <SettingsIcon/>

</div>


</div>

    </div>
  )
}

export default Navbar