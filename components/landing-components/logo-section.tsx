import Link from 'next/link';
import Image from 'next/image';
import { Pacifico } from 'next/font/google';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
})

export const LogoSection = () => {

  return (
    <div className="container w-full flex items-start justify-start py-4">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="V3 Studio Logo"
          width={120}
          height={80}
          className="h-10 w-auto"
          priority
        />
        <span className={`text-2xl md:text-4xl font-bold text-yellow-500 ${pacifico.className}`}>V3 Studio</span>
      </Link>
    </div>
  )
}
