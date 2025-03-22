import React from 'react'

export default function Footer() {
  return (
    <div class="flex flex-col sm:flex-row justify-center gap-2 items-center">
    <p class="text-sm">© 2024 UmEmployed. All rights reserved.</p>
    <div class="flex space-x-4 items-center">
      <a href="/accounts/user/feature-not-implemented/" class="text-white hover:text-gray-300">
        <i class="fab fa-twitter text-black"></i>
      </a>
      <a href="/accounts/user/feature-not-implemented/" class="text-white hover:text-gray-300">
        <i class="fab fa-linkedin text-black"></i>
      </a>
      <a href="/accounts/user/feature-not-implemented/" class="text-white hover:text-gray-300">
        <i class="fab fa-facebook text-black"></i>
      </a>
      <img src="/images/privacy.png" alt="" class="w-10 h-5" />
    </div>
    <div class="text-sm ">
                    
      <a href="/accounts/user/feature-not-implemented/" class="hover:text-gray-300">Privacy Policy
        </a>
      
      <a href="/accounts/user/feature-not-implemented/" class="hover:text-gray-300">Contact Us</a>
    </div>
  </div>
  )
}
